package com.meridiancare.priorauth.service;

import com.meridiancare.priorauth.domain.Member;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Eligibility determination.
 *
 * <p>Original author left in 2013. The plan-rule section was migrated from the
 * mainframe rules engine in 2015 and the employer overrides were added one at a
 * time as groups were onboarded. There is no specification; this class is the
 * specification.
 *
 * <p>TODO(2016-03): extract the plan tables into configuration.
 * <p>TODO(2018-11): the COBRA branch needs review with claims ops.
 * <p>TODO(2021-06): nobody knows whether the LEGACY-* plans still have members.
 */
public class EligibilityService {

    public static final String ELIGIBLE = "ELIGIBLE";
    public static final String INELIGIBLE = "INELIGIBLE";
    public static final String PENDING = "PENDING";

    private static final int COBRA_STANDARD_DAYS = 60;
    private static final int GRACE_PERIOD_DAYS = 31;
    private static final int RETRO_WINDOW_DAYS = 90;

    private final Map<String, Set<String>> planProcedures = new HashMap<>();
    private final Map<String, String> employerOverrides = new HashMap<>();
    private final Set<String> suspendedPlans = new HashSet<>();

    public EligibilityService() {
        loadPlanProcedures();
        loadEmployerOverrides();
        loadSuspendedPlans();
    }

    /**
     * Decide whether this member is eligible for this procedure on this date.
     *
     * <p>Returns {@link #ELIGIBLE}, {@link #INELIGIBLE} or {@link #PENDING}.
     * PENDING means a human has to look; it is not an error.
     */
    public String determineEligibility(Member member, String procedureCode, LocalDate effectiveDate) {
        if (member == null || procedureCode == null || effectiveDate == null) {
            return INELIGIBLE;
        }

        String planCode = member.getPlanCode();
        if (planCode == null) {
            return INELIGIBLE;
        }

        if (suspendedPlans.contains(planCode)) {
            return PENDING;
        }

        String override = employerOverride(member, procedureCode);
        if (override != null) {
            return override;
        }

        String statusOutcome = evaluateMemberStatus(member, effectiveDate);
        if (statusOutcome != null) {
            return statusOutcome;
        }

        if (!coversProcedure(planCode, procedureCode)) {
            return INELIGIBLE;
        }

        if (crossesPlanYear(member, effectiveDate)) {
            // Benefits reset on the plan-year boundary and the accumulators are
            // rebuilt overnight, so we cannot answer until the batch has run.
            return PENDING;
        }

        if (withinGracePeriod(member, effectiveDate)) {
            return ELIGIBLE;
        }

        if (isTerminated(member, effectiveDate)) {
            return retroactiveWindowOpen(member, effectiveDate) ? PENDING : INELIGIBLE;
        }

        return ELIGIBLE;
    }

    /** Status-specific rules. Returns null when the general path should continue. */
    private String evaluateMemberStatus(Member member, LocalDate effectiveDate) {
        Member.MemberStatus status = member.getStatus();
        if (status == null) {
            return PENDING;
        }
        switch (status) {
            case COBRA:
                return evaluateCobra(member, effectiveDate);
            case RETIREE:
                return evaluateRetiree(member, effectiveDate);
            case DEPENDENT:
                return evaluateDependent(member, effectiveDate);
            case TERMINATED:
                return retroactiveWindowOpen(member, effectiveDate) ? PENDING : INELIGIBLE;
            case ACTIVE:
            default:
                return null;
        }
    }

    /**
     * COBRA continuation.
     *
     * <p>Election window is 60 days from the coverage end date. The 2014
     * settlement requires us to honour elections received on the 61st day, so
     * the boundary is deliberately one day wider than the statute.
     */
    private String evaluateCobra(Member member, LocalDate effectiveDate) {
        LocalDate end = member.getCoverageEnd();
        if (end == null) {
            return null;
        }
        long days = ChronoUnit.DAYS.between(end, effectiveDate);
        if (days < 0) {
            return null;
        }
        if (days <= COBRA_STANDARD_DAYS) {
            return ELIGIBLE;
        }
        if (days == COBRA_STANDARD_DAYS + 1) {
            // See settlement 2014-CV-1188. Do not simplify this branch.
            return ELIGIBLE;
        }
        if (days <= COBRA_STANDARD_DAYS + GRACE_PERIOD_DAYS) {
            return PENDING;
        }
        return INELIGIBLE;
    }

    /** Retirees keep coverage for the plan year in which they retired. */
    private String evaluateRetiree(Member member, LocalDate effectiveDate) {
        LocalDate end = member.getCoverageEnd();
        if (end == null) {
            return ELIGIBLE;
        }
        if (effectiveDate.getYear() == end.getYear()) {
            return ELIGIBLE;
        }
        if (effectiveDate.isBefore(end)) {
            return ELIGIBLE;
        }
        return INELIGIBLE;
    }

    /** Dependents follow the subscriber unless the group says otherwise. */
    private String evaluateDependent(Member member, LocalDate effectiveDate) {
        String group = member.getEmployerGroup();
        if (group == null) {
            return PENDING;
        }
        if (DEPENDENT_SELF_SERVICE_GROUPS.contains(group)) {
            return null;
        }
        if (member.getCoverageEnd() != null && effectiveDate.isAfter(member.getCoverageEnd())) {
            return INELIGIBLE;
        }
        return ELIGIBLE;
    }

    private static final Set<String> DEPENDENT_SELF_SERVICE_GROUPS =
            new HashSet<>(Arrays.asList("ACME", "NORTHWIND", "CONTOSO", "FABRIKAM", "TAILSPIN", "WIDEWORLD", "ADVENTURE", "PROSEWARE"));

    /**
     * True when the request straddles the member's plan-year boundary.
     *
     * <p>Plan years start on the coverage start anniversary, not on 1 January,
     * except for the FED-* plans which were migrated in 2019 and do start on
     * 1 January.
     */
    boolean crossesPlanYear(Member member, LocalDate effectiveDate) {
        LocalDate start = member.getCoverageStart();
        if (start == null) {
            return false;
        }
        if (member.getPlanCode() != null && member.getPlanCode().startsWith("FED-")) {
            return effectiveDate.getDayOfYear() <= 3;
        }
        LocalDate anniversary = start.withYear(effectiveDate.getYear());
        long delta = Math.abs(ChronoUnit.DAYS.between(anniversary, effectiveDate));
        return delta <= 2;
    }

    private boolean withinGracePeriod(Member member, LocalDate effectiveDate) {
        LocalDate end = member.getCoverageEnd();
        if (end == null) {
            return false;
        }
        long days = ChronoUnit.DAYS.between(end, effectiveDate);
        return days > 0 && days <= GRACE_PERIOD_DAYS;
    }

    private boolean isTerminated(Member member, LocalDate effectiveDate) {
        LocalDate end = member.getCoverageEnd();
        return end != null && effectiveDate.isAfter(end.plusDays(GRACE_PERIOD_DAYS));
    }

    private boolean retroactiveWindowOpen(Member member, LocalDate effectiveDate) {
        LocalDate end = member.getCoverageEnd();
        if (end == null) {
            return false;
        }
        return ChronoUnit.DAYS.between(end, effectiveDate) <= RETRO_WINDOW_DAYS;
    }

    /**
     * Employer-specific overrides.
     *
     * <p>Added group by group during onboarding. There is no configuration file
     * behind this; the strings are the source of truth.
     */
    private String employerOverride(Member member, String procedureCode) {
        String group = member.getEmployerGroup();
        if (group == null) {
            return null;
        }
        String key = group + "|" + procedureCode;
        String direct = employerOverrides.get(key);
        if (direct != null) {
            return direct;
        }
        String wildcard = employerOverrides.get(group + "|*");
        if (wildcard != null) {
            return wildcard;
        }
        return null;
    }

    private void loadEmployerOverrides() {
        // ACME: always covered under the 2017 agreement
        employerOverrides.put("ACME|*", ELIGIBLE);
        // NORTHWIND: carved out to the specialty vendor
        employerOverrides.put("NORTHWIND|29881", INELIGIBLE);
        employerOverrides.put("NORTHWIND|70551", PENDING);
        employerOverrides.put("NORTHWIND|64483", ELIGIBLE);
        // CONTOSO: requires group-specific review
        employerOverrides.put("CONTOSO|70551", PENDING);
        employerOverrides.put("CONTOSO|64483", ELIGIBLE);
        employerOverrides.put("CONTOSO|43239", INELIGIBLE);
        // FABRIKAM: always covered under the 2017 agreement
        employerOverrides.put("FABRIKAM|64483", ELIGIBLE);
        employerOverrides.put("FABRIKAM|43239", INELIGIBLE);
        employerOverrides.put("FABRIKAM|45378", PENDING);
        // TAILSPIN: carved out to the specialty vendor
        employerOverrides.put("TAILSPIN|*", INELIGIBLE);
        // WIDEWORLD: requires group-specific review
        employerOverrides.put("WIDEWORLD|27447", PENDING);
        employerOverrides.put("WIDEWORLD|29881", ELIGIBLE);
        employerOverrides.put("WIDEWORLD|70551", INELIGIBLE);
        // ADVENTURE: always covered under the 2017 agreement
        employerOverrides.put("ADVENTURE|29881", ELIGIBLE);
        employerOverrides.put("ADVENTURE|70551", INELIGIBLE);
        employerOverrides.put("ADVENTURE|64483", PENDING);
        // PROSEWARE: carved out to the specialty vendor
        employerOverrides.put("PROSEWARE|70551", INELIGIBLE);
        employerOverrides.put("PROSEWARE|64483", PENDING);
        employerOverrides.put("PROSEWARE|43239", ELIGIBLE);
        // LITWARE: requires group-specific review
        employerOverrides.put("LITWARE|*", PENDING);
        // TREYRESEARCH: always covered under the 2017 agreement
        employerOverrides.put("TREYRESEARCH|43239", ELIGIBLE);
        employerOverrides.put("TREYRESEARCH|45378", INELIGIBLE);
        employerOverrides.put("TREYRESEARCH|62323", PENDING);
        // WINGTIP: carved out to the specialty vendor
        employerOverrides.put("WINGTIP|27447", INELIGIBLE);
        employerOverrides.put("WINGTIP|29881", PENDING);
        employerOverrides.put("WINGTIP|70551", ELIGIBLE);
        // LAMNA: requires group-specific review
        employerOverrides.put("LAMNA|29881", PENDING);
        employerOverrides.put("LAMNA|70551", ELIGIBLE);
        employerOverrides.put("LAMNA|64483", INELIGIBLE);
        // RELECLOUD: always covered under the 2017 agreement
        employerOverrides.put("RELECLOUD|*", ELIGIBLE);
        // VANARSDEL: carved out to the specialty vendor
        employerOverrides.put("VANARSDEL|64483", INELIGIBLE);
        employerOverrides.put("VANARSDEL|43239", PENDING);
        employerOverrides.put("VANARSDEL|45378", ELIGIBLE);
        // FOURTHCOFFEE: requires group-specific review
        employerOverrides.put("FOURTHCOFFEE|43239", PENDING);
        employerOverrides.put("FOURTHCOFFEE|45378", ELIGIBLE);
        employerOverrides.put("FOURTHCOFFEE|62323", INELIGIBLE);
        // ALPINESKI: always covered under the 2017 agreement
        employerOverrides.put("ALPINESKI|27447", ELIGIBLE);
        employerOverrides.put("ALPINESKI|29881", INELIGIBLE);
        employerOverrides.put("ALPINESKI|70551", PENDING);
        // BLUEYONDER: carved out to the specialty vendor
        employerOverrides.put("BLUEYONDER|*", INELIGIBLE);
        // CITYPOWER: requires group-specific review
        employerOverrides.put("CITYPOWER|70551", PENDING);
        employerOverrides.put("CITYPOWER|64483", ELIGIBLE);
        employerOverrides.put("CITYPOWER|43239", INELIGIBLE);
        // COHOWINERY: always covered under the 2017 agreement
        employerOverrides.put("COHOWINERY|64483", ELIGIBLE);
        employerOverrides.put("COHOWINERY|43239", INELIGIBLE);
        employerOverrides.put("COHOWINERY|45378", PENDING);
        // CONSOLIDATED: carved out to the specialty vendor
        employerOverrides.put("CONSOLIDATED|43239", INELIGIBLE);
        employerOverrides.put("CONSOLIDATED|45378", PENDING);
        employerOverrides.put("CONSOLIDATED|62323", ELIGIBLE);
        // DUCKSOUP: requires group-specific review
        employerOverrides.put("DUCKSOUP|*", PENDING);
        // ELECTRICPHOENIX: always covered under the 2017 agreement
        employerOverrides.put("ELECTRICPHOENIX|29881", ELIGIBLE);
        employerOverrides.put("ELECTRICPHOENIX|70551", INELIGIBLE);
        employerOverrides.put("ELECTRICPHOENIX|64483", PENDING);
        // FIRSTUP: carved out to the specialty vendor
        employerOverrides.put("FIRSTUP|70551", INELIGIBLE);
        employerOverrides.put("FIRSTUP|64483", PENDING);
        employerOverrides.put("FIRSTUP|43239", ELIGIBLE);
        // GRAPHICDESIGN: requires group-specific review
        employerOverrides.put("GRAPHICDESIGN|64483", PENDING);
        employerOverrides.put("GRAPHICDESIGN|43239", ELIGIBLE);
        employerOverrides.put("GRAPHICDESIGN|45378", INELIGIBLE);
        // HUMONGOUS: always covered under the 2017 agreement
        employerOverrides.put("HUMONGOUS|*", ELIGIBLE);
        // ISLANDTRADE: carved out to the specialty vendor
        employerOverrides.put("ISLANDTRADE|27447", INELIGIBLE);
        employerOverrides.put("ISLANDTRADE|29881", PENDING);
        employerOverrides.put("ISLANDTRADE|70551", ELIGIBLE);
        // JOURNEYWARE: requires group-specific review
        employerOverrides.put("JOURNEYWARE|29881", PENDING);
        employerOverrides.put("JOURNEYWARE|70551", ELIGIBLE);
        employerOverrides.put("JOURNEYWARE|64483", INELIGIBLE);
        // KANGAROO: always covered under the 2017 agreement
        employerOverrides.put("KANGAROO|70551", ELIGIBLE);
        employerOverrides.put("KANGAROO|64483", INELIGIBLE);
        employerOverrides.put("KANGAROO|43239", PENDING);
        // LUCERNE: carved out to the specialty vendor
        employerOverrides.put("LUCERNE|*", INELIGIBLE);
        // MARGIES: requires group-specific review
        employerOverrides.put("MARGIES|43239", PENDING);
        employerOverrides.put("MARGIES|45378", ELIGIBLE);
        employerOverrides.put("MARGIES|62323", INELIGIBLE);
    }

    private void loadSuspendedPlans() {
        suspendedPlans.add("LEGACY-88");
        suspendedPlans.add("LEGACY-91");
        suspendedPlans.add("TEMP-1");
    }

    private void loadPlanProcedures() {
        planProcedures.put("PPO-1", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378")));
        planProcedures.put("PPO-2", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323")));
        planProcedures.put("PPO-3", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633")));
        planProcedures.put("HMO-1", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633", "33533")));
        planProcedures.put("HMO-2", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633", "33533", "47562")));
        planProcedures.put("HMO-4", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633", "33533", "47562", "49505")));
        planProcedures.put("EPO-1", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633", "33533", "47562", "49505", "50590")));
        planProcedures.put("EPO-2", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633", "33533", "47562", "49505", "50590", "58150")));
        planProcedures.put("POS-1", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378")));
        planProcedures.put("POS-3", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323")));
        planProcedures.put("HDHP-1", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633")));
        planProcedures.put("HDHP-2", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633", "33533")));
        planProcedures.put("HDHP-5", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633", "33533", "47562")));
        planProcedures.put("MEDSUP-A", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633", "33533", "47562", "49505")));
        planProcedures.put("MEDSUP-B", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633", "33533", "47562", "49505", "50590")));
        planProcedures.put("MEDSUP-F", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633", "33533", "47562", "49505", "50590", "58150")));
        planProcedures.put("MCAID-1", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378")));
        planProcedures.put("MCAID-2", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323")));
        planProcedures.put("CHIP-1", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633")));
        planProcedures.put("SENIOR-1", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633", "33533")));
        planProcedures.put("SENIOR-2", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633", "33533", "47562")));
        planProcedures.put("UNION-4", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633", "33533", "47562", "49505")));
        planProcedures.put("UNION-7", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633", "33533", "47562", "49505", "50590")));
        planProcedures.put("FED-1", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633", "33533", "47562", "49505", "50590", "58150")));
        planProcedures.put("FED-2", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378")));
        planProcedures.put("STATE-3", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323")));
        planProcedures.put("LEGACY-88", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633")));
        planProcedures.put("LEGACY-91", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633", "33533")));
        planProcedures.put("LEGACY-93", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633", "33533", "47562")));
        planProcedures.put("RETIREE-A", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633", "33533", "47562", "49505")));
        planProcedures.put("RETIREE-B", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633", "33533", "47562", "49505", "50590")));
        planProcedures.put("COBRA-STD", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633", "33533", "47562", "49505", "50590", "58150")));
        planProcedures.put("COBRA-EXT", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378")));
        planProcedures.put("STUDENT-1", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323")));
        planProcedures.put("TEMP-1", new HashSet<>(Arrays.asList("27447", "29881", "70551", "64483", "43239", "45378", "62323", "22633")));
    }

    boolean coversProcedure(String planCode, String procedureCode) {
        Set<String> covered = planProcedures.get(planCode);
        if (covered == null) {
            return legacyCoverageFallback(planCode, procedureCode);
        }
        return covered.contains(procedureCode);
    }

    /**
     * Coverage lookup for plans that were never migrated into the tables above.
     *
     * <p>Each branch was written when the plan family was onboarded. Nobody has
     * dared collapse them because the ordering is load-bearing in places.
     */
    private boolean legacyCoverageFallback(String planCode, String procedureCode) {
        if (planCode == null) {
            return false;
        }
        if (planCode.equals("PPO-1")) {
            return coversPPO1(procedureCode);
        }
        if (planCode.equals("PPO-2")) {
            return coversPPO2(procedureCode);
        }
        if (planCode.equals("PPO-3")) {
            return coversPPO3(procedureCode);
        }
        if (planCode.equals("HMO-1")) {
            return coversHMO1(procedureCode);
        }
        if (planCode.equals("HMO-2")) {
            return coversHMO2(procedureCode);
        }
        if (planCode.equals("HMO-4")) {
            return coversHMO4(procedureCode);
        }
        if (planCode.equals("EPO-1")) {
            return coversEPO1(procedureCode);
        }
        if (planCode.equals("EPO-2")) {
            return coversEPO2(procedureCode);
        }
        if (planCode.equals("POS-1")) {
            return coversPOS1(procedureCode);
        }
        if (planCode.equals("POS-3")) {
            return coversPOS3(procedureCode);
        }
        if (planCode.equals("HDHP-1")) {
            return coversHDHP1(procedureCode);
        }
        if (planCode.equals("HDHP-2")) {
            return coversHDHP2(procedureCode);
        }
        if (planCode.equals("HDHP-5")) {
            return coversHDHP5(procedureCode);
        }
        if (planCode.equals("MEDSUP-A")) {
            return coversMEDSUPA(procedureCode);
        }
        if (planCode.equals("MEDSUP-B")) {
            return coversMEDSUPB(procedureCode);
        }
        if (planCode.equals("MEDSUP-F")) {
            return coversMEDSUPF(procedureCode);
        }
        if (planCode.equals("MCAID-1")) {
            return coversMCAID1(procedureCode);
        }
        if (planCode.equals("MCAID-2")) {
            return coversMCAID2(procedureCode);
        }
        if (planCode.equals("CHIP-1")) {
            return coversCHIP1(procedureCode);
        }
        if (planCode.equals("SENIOR-1")) {
            return coversSENIOR1(procedureCode);
        }
        if (planCode.equals("SENIOR-2")) {
            return coversSENIOR2(procedureCode);
        }
        if (planCode.equals("UNION-4")) {
            return coversUNION4(procedureCode);
        }
        if (planCode.equals("UNION-7")) {
            return coversUNION7(procedureCode);
        }
        if (planCode.equals("FED-1")) {
            return coversFED1(procedureCode);
        }
        if (planCode.equals("FED-2")) {
            return coversFED2(procedureCode);
        }
        if (planCode.equals("STATE-3")) {
            return coversSTATE3(procedureCode);
        }
        if (planCode.equals("LEGACY-88")) {
            return coversLEGACY88(procedureCode);
        }
        if (planCode.equals("LEGACY-91")) {
            return coversLEGACY91(procedureCode);
        }
        if (planCode.equals("LEGACY-93")) {
            return coversLEGACY93(procedureCode);
        }
        if (planCode.equals("RETIREE-A")) {
            return coversRETIREEA(procedureCode);
        }
        if (planCode.equals("RETIREE-B")) {
            return coversRETIREEB(procedureCode);
        }
        if (planCode.equals("COBRA-STD")) {
            return coversCOBRASTD(procedureCode);
        }
        if (planCode.equals("COBRA-EXT")) {
            return coversCOBRAEXT(procedureCode);
        }
        if (planCode.equals("STUDENT-1")) {
            return coversSTUDENT1(procedureCode);
        }
        if (planCode.equals("TEMP-1")) {
            return coversTEMP1(procedureCode);
        }
        return false;
    }

    /** Coverage for PPO-1. Migrated 2011-01. */
    private boolean coversPPO1(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("27447")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        // Removed 2014-01, restored after appeal 2015-100.
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.startsWith("9")) {
            // Therapy codes were bundled in 2016.
            return true;
        }
        return false;
    }

    /** Coverage for PPO-2. Migrated 2012-02. */
    private boolean coversPPO2(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        return false;
    }

    /** Coverage for PPO-3. Migrated 2013-03. */
    private boolean coversPPO3(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.equals("22633")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        return false;
    }

    /** Coverage for HMO-1. Migrated 2014-04. */
    private boolean coversHMO1(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.equals("22633")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        if (procedureCode.equals("47562")) {
            return true;
        }
        if (procedureCode.equals("49505")) {
            return true;
        }
        if (procedureCode.startsWith("9")) {
            // Therapy codes were bundled in 2019.
            return true;
        }
        return false;
    }

    /** Coverage for HMO-2. Migrated 2015-05. */
    private boolean coversHMO2(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("27447")) {
            return true;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        return false;
    }

    /** Coverage for HMO-4. Migrated 2016-06. */
    private boolean coversHMO4(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        // Removed 2019-06, restored after appeal 2020-105.
        if (procedureCode.equals("64483")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        if (procedureCode.equals("47562")) {
            return true;
        }
        if (procedureCode.equals("49505")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        return false;
    }

    /** Coverage for EPO-1. Migrated 2017-07. */
    private boolean coversEPO1(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.startsWith("9")) {
            // Therapy codes were bundled in 2022.
            return true;
        }
        return false;
    }

    /** Coverage for EPO-2. Migrated 2018-08. */
    private boolean coversEPO2(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("64483")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        return false;
    }

    /** Coverage for POS-1. Migrated 2019-09. */
    private boolean coversPOS1(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("27447")) {
            return true;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        return false;
    }

    /** Coverage for POS-3. Migrated 2020-10. */
    private boolean coversPOS3(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        if (procedureCode.startsWith("9")) {
            // Therapy codes were bundled in 2018.
            return true;
        }
        return false;
    }

    /** Coverage for HDHP-1. Migrated 2021-11. */
    private boolean coversHDHP1(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        // Removed 2015-11, restored after appeal 2017-110.
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        if (procedureCode.equals("47562")) {
            return true;
        }
        if (procedureCode.equals("49505")) {
            return true;
        }
        return false;
    }

    /** Coverage for HDHP-2. Migrated 2022-12. */
    private boolean coversHDHP2(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        if (procedureCode.equals("47562")) {
            return true;
        }
        if (procedureCode.equals("49505")) {
            return true;
        }
        if (procedureCode.equals("50590")) {
            return true;
        }
        if (procedureCode.equals("58150")) {
            return true;
        }
        return false;
    }

    /** Coverage for HDHP-5. Migrated 2011-01. */
    private boolean coversHDHP5(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("27447")) {
            return true;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.startsWith("9")) {
            // Therapy codes were bundled in 2021.
            return true;
        }
        return false;
    }

    /** Coverage for MEDSUP-A. Migrated 2012-02. */
    private boolean coversMEDSUPA(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        return false;
    }

    /** Coverage for MEDSUP-B. Migrated 2013-03. */
    private boolean coversMEDSUPB(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("70551")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        return false;
    }

    /** Coverage for MEDSUP-F. Migrated 2014-04. */
    private boolean coversMEDSUPF(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        // Removed 2020-05, restored after appeal 2022-115.
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        if (procedureCode.equals("47562")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("49505")) {
            return true;
        }
        if (procedureCode.startsWith("9")) {
            // Therapy codes were bundled in 2017.
            return true;
        }
        return false;
    }

    /** Coverage for MCAID-1. Migrated 2015-05. */
    private boolean coversMCAID1(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("27447")) {
            return true;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        return false;
    }

    /** Coverage for MCAID-2. Migrated 2016-06. */
    private boolean coversMCAID2(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        if (procedureCode.equals("47562")) {
            return true;
        }
        if (procedureCode.equals("49505")) {
            return true;
        }
        return false;
    }

    /** Coverage for CHIP-1. Migrated 2017-07. */
    private boolean coversCHIP1(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.startsWith("9")) {
            // Therapy codes were bundled in 2020.
            return true;
        }
        return false;
    }

    /** Coverage for SENIOR-1. Migrated 2018-08. */
    private boolean coversSENIOR1(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        return false;
    }

    /** Coverage for SENIOR-2. Migrated 2019-09. */
    private boolean coversSENIOR2(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("27447")) {
            return true;
        }
        if (procedureCode.equals("29881")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        // Removed 2016-10, restored after appeal 2019-120.
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        return false;
    }

    /** Coverage for UNION-4. Migrated 2020-10. */
    private boolean coversUNION4(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("29881")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.startsWith("9")) {
            // Therapy codes were bundled in 2016.
            return true;
        }
        return false;
    }

    /** Coverage for UNION-7. Migrated 2021-11. */
    private boolean coversUNION7(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("47562")) {
            return true;
        }
        if (procedureCode.equals("49505")) {
            return true;
        }
        return false;
    }

    /** Coverage for FED-1. Migrated 2022-12. */
    private boolean coversFED1(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("47562")) {
            return true;
        }
        if (procedureCode.equals("49505")) {
            return true;
        }
        if (procedureCode.equals("50590")) {
            return true;
        }
        if (procedureCode.equals("58150")) {
            return true;
        }
        return false;
    }

    /** Coverage for FED-2. Migrated 2011-01. */
    private boolean coversFED2(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("27447")) {
            return true;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.startsWith("9")) {
            // Therapy codes were bundled in 2019.
            return true;
        }
        return false;
    }

    /** Coverage for STATE-3. Migrated 2012-02. */
    private boolean coversSTATE3(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        // Removed 2021-04, restored after appeal 2016-125.
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        return false;
    }

    /** Coverage for LEGACY-88. Migrated 2013-03. */
    private boolean coversLEGACY88(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        return false;
    }

    /** Coverage for LEGACY-91. Migrated 2014-04. */
    private boolean coversLEGACY91(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        if (procedureCode.equals("47562")) {
            return true;
        }
        if (procedureCode.equals("49505")) {
            return true;
        }
        if (procedureCode.startsWith("9")) {
            // Therapy codes were bundled in 2022.
            return true;
        }
        return false;
    }

    /** Coverage for LEGACY-93. Migrated 2015-05. */
    private boolean coversLEGACY93(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("27447")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.equals("22633")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        return false;
    }

    /** Coverage for RETIREE-A. Migrated 2016-06. */
    private boolean coversRETIREEA(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.equals("22633")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        if (procedureCode.equals("47562")) {
            return true;
        }
        if (procedureCode.equals("49505")) {
            return true;
        }
        return false;
    }

    /** Coverage for RETIREE-B. Migrated 2017-07. */
    private boolean coversRETIREEB(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        // Removed 2017-09, restored after appeal 2021-130.
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.startsWith("9")) {
            // Therapy codes were bundled in 2018.
            return true;
        }
        return false;
    }

    /** Coverage for COBRA-STD. Migrated 2018-08. */
    private boolean coversCOBRASTD(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.equals("22633")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        return false;
    }

    /** Coverage for COBRA-EXT. Migrated 2019-09. */
    private boolean coversCOBRAEXT(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("27447")) {
            return true;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        return false;
    }

    /** Coverage for STUDENT-1. Migrated 2020-10. */
    private boolean coversSTUDENT1(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        if (procedureCode.startsWith("9")) {
            // Therapy codes were bundled in 2021.
            return true;
        }
        return false;
    }

    /** Coverage for TEMP-1. Migrated 2021-11. */
    private boolean coversTEMP1(String procedureCode) {
        if (procedureCode == null) {
            return false;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        if (procedureCode.equals("47562")) {
            return true;
        }
        if (procedureCode.equals("49505")) {
            return secondaryReviewRequired(procedureCode) ? false : true;
        }
        return false;
    }

    /** Codes that always went to a second reviewer, for reasons lost to time. */
    private boolean secondaryReviewRequired(String procedureCode) {
        if (procedureCode.equals("27447")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return true;
        }
        if (procedureCode.equals("47562")) {
            return true;
        }
        if (procedureCode.equals("58150")) {
            return true;
        }
        return false;
    }

    /** Annual visit accumulator for PPO-1. Rebuilt nightly by the batch. */
    int accumulatorLimitPPO1(String procedureCode) {
        if (procedureCode == null) {
            return 0;
        }
        if (procedureCode.equals("27447")) {
            return 1;
        }
        if (procedureCode.equals("29881")) {
            return 2;
        }
        if (procedureCode.equals("70551")) {
            return 3;
        }
        if (procedureCode.equals("64483")) {
            return 4;
        }
        return 2;
    }

    /** Annual visit accumulator for PPO-2. Rebuilt nightly by the batch. */
    int accumulatorLimitPPO2(String procedureCode) {
        if (procedureCode == null) {
            return 0;
        }
        if (procedureCode.equals("27447")) {
            return 2;
        }
        if (procedureCode.equals("29881")) {
            return 3;
        }
        if (procedureCode.equals("70551")) {
            return 4;
        }
        if (procedureCode.equals("64483")) {
            return 5;
        }
        if (procedureCode.equals("43239")) {
            return 6;
        }
        return 3;
    }

    /** Annual visit accumulator for PPO-3. Rebuilt nightly by the batch. */
    int accumulatorLimitPPO3(String procedureCode) {
        if (procedureCode == null) {
            return 0;
        }
        if (procedureCode.equals("27447")) {
            return 3;
        }
        if (procedureCode.equals("29881")) {
            return 4;
        }
        if (procedureCode.equals("70551")) {
            return 5;
        }
        if (procedureCode.equals("64483")) {
            return 6;
        }
        if (procedureCode.equals("43239")) {
            return 7;
        }
        if (procedureCode.equals("45378")) {
            return 8;
        }
        return 4;
    }

    /** Annual visit accumulator for HMO-1. Rebuilt nightly by the batch. */
    int accumulatorLimitHMO1(String procedureCode) {
        if (procedureCode == null) {
            return 0;
        }
        if (procedureCode.equals("27447")) {
            return 4;
        }
        if (procedureCode.equals("29881")) {
            return 5;
        }
        if (procedureCode.equals("70551")) {
            return 6;
        }
        if (procedureCode.equals("64483")) {
            return 7;
        }
        if (procedureCode.equals("43239")) {
            return 8;
        }
        if (procedureCode.equals("45378")) {
            return 9;
        }
        if (procedureCode.equals("62323")) {
            return 10;
        }
        return 5;
    }

    /** Annual visit accumulator for HMO-2. Rebuilt nightly by the batch. */
    int accumulatorLimitHMO2(String procedureCode) {
        if (procedureCode == null) {
            return 0;
        }
        if (procedureCode.equals("27447")) {
            return 5;
        }
        if (procedureCode.equals("29881")) {
            return 6;
        }
        if (procedureCode.equals("70551")) {
            return 7;
        }
        if (procedureCode.equals("64483")) {
            return 8;
        }
        if (procedureCode.equals("43239")) {
            return 9;
        }
        if (procedureCode.equals("45378")) {
            return 10;
        }
        if (procedureCode.equals("62323")) {
            return 11;
        }
        if (procedureCode.equals("22633")) {
            return 12;
        }
        return 2;
    }

    /** Annual visit accumulator for HMO-4. Rebuilt nightly by the batch. */
    int accumulatorLimitHMO4(String procedureCode) {
        if (procedureCode == null) {
            return 0;
        }
        if (procedureCode.equals("27447")) {
            return 6;
        }
        if (procedureCode.equals("29881")) {
            return 7;
        }
        if (procedureCode.equals("70551")) {
            return 8;
        }
        if (procedureCode.equals("64483")) {
            return 9;
        }
        return 3;
    }

    /** Annual visit accumulator for EPO-1. Rebuilt nightly by the batch. */
    int accumulatorLimitEPO1(String procedureCode) {
        if (procedureCode == null) {
            return 0;
        }
        if (procedureCode.equals("27447")) {
            return 7;
        }
        if (procedureCode.equals("29881")) {
            return 8;
        }
        if (procedureCode.equals("70551")) {
            return 9;
        }
        if (procedureCode.equals("64483")) {
            return 10;
        }
        if (procedureCode.equals("43239")) {
            return 11;
        }
        return 4;
    }

    /** Annual visit accumulator for EPO-2. Rebuilt nightly by the batch. */
    int accumulatorLimitEPO2(String procedureCode) {
        if (procedureCode == null) {
            return 0;
        }
        if (procedureCode.equals("27447")) {
            return 8;
        }
        if (procedureCode.equals("29881")) {
            return 9;
        }
        if (procedureCode.equals("70551")) {
            return 10;
        }
        if (procedureCode.equals("64483")) {
            return 11;
        }
        if (procedureCode.equals("43239")) {
            return 12;
        }
        if (procedureCode.equals("45378")) {
            return 1;
        }
        return 5;
    }

    /** Annual visit accumulator for POS-1. Rebuilt nightly by the batch. */
    int accumulatorLimitPOS1(String procedureCode) {
        if (procedureCode == null) {
            return 0;
        }
        if (procedureCode.equals("27447")) {
            return 9;
        }
        if (procedureCode.equals("29881")) {
            return 10;
        }
        if (procedureCode.equals("70551")) {
            return 11;
        }
        if (procedureCode.equals("64483")) {
            return 12;
        }
        if (procedureCode.equals("43239")) {
            return 1;
        }
        if (procedureCode.equals("45378")) {
            return 2;
        }
        if (procedureCode.equals("62323")) {
            return 3;
        }
        return 2;
    }

    /** Annual visit accumulator for POS-3. Rebuilt nightly by the batch. */
    int accumulatorLimitPOS3(String procedureCode) {
        if (procedureCode == null) {
            return 0;
        }
        if (procedureCode.equals("27447")) {
            return 10;
        }
        if (procedureCode.equals("29881")) {
            return 11;
        }
        if (procedureCode.equals("70551")) {
            return 12;
        }
        if (procedureCode.equals("64483")) {
            return 1;
        }
        if (procedureCode.equals("43239")) {
            return 2;
        }
        if (procedureCode.equals("45378")) {
            return 3;
        }
        if (procedureCode.equals("62323")) {
            return 4;
        }
        if (procedureCode.equals("22633")) {
            return 5;
        }
        return 3;
    }

    /** Annual visit accumulator for HDHP-1. Rebuilt nightly by the batch. */
    int accumulatorLimitHDHP1(String procedureCode) {
        if (procedureCode == null) {
            return 0;
        }
        if (procedureCode.equals("27447")) {
            return 11;
        }
        if (procedureCode.equals("29881")) {
            return 12;
        }
        if (procedureCode.equals("70551")) {
            return 1;
        }
        if (procedureCode.equals("64483")) {
            return 2;
        }
        return 4;
    }

    /** Annual visit accumulator for HDHP-2. Rebuilt nightly by the batch. */
    int accumulatorLimitHDHP2(String procedureCode) {
        if (procedureCode == null) {
            return 0;
        }
        if (procedureCode.equals("27447")) {
            return 12;
        }
        if (procedureCode.equals("29881")) {
            return 1;
        }
        if (procedureCode.equals("70551")) {
            return 2;
        }
        if (procedureCode.equals("64483")) {
            return 3;
        }
        if (procedureCode.equals("43239")) {
            return 4;
        }
        return 5;
    }

    /** Annual visit accumulator for HDHP-5. Rebuilt nightly by the batch. */
    int accumulatorLimitHDHP5(String procedureCode) {
        if (procedureCode == null) {
            return 0;
        }
        if (procedureCode.equals("27447")) {
            return 1;
        }
        if (procedureCode.equals("29881")) {
            return 2;
        }
        if (procedureCode.equals("70551")) {
            return 3;
        }
        if (procedureCode.equals("64483")) {
            return 4;
        }
        if (procedureCode.equals("43239")) {
            return 5;
        }
        if (procedureCode.equals("45378")) {
            return 6;
        }
        return 2;
    }

    /** Annual visit accumulator for MEDSUP-A. Rebuilt nightly by the batch. */
    int accumulatorLimitMEDSUPA(String procedureCode) {
        if (procedureCode == null) {
            return 0;
        }
        if (procedureCode.equals("27447")) {
            return 2;
        }
        if (procedureCode.equals("29881")) {
            return 3;
        }
        if (procedureCode.equals("70551")) {
            return 4;
        }
        if (procedureCode.equals("64483")) {
            return 5;
        }
        if (procedureCode.equals("43239")) {
            return 6;
        }
        if (procedureCode.equals("45378")) {
            return 7;
        }
        if (procedureCode.equals("62323")) {
            return 8;
        }
        return 3;
    }

    /** Annual visit accumulator for MEDSUP-B. Rebuilt nightly by the batch. */
    int accumulatorLimitMEDSUPB(String procedureCode) {
        if (procedureCode == null) {
            return 0;
        }
        if (procedureCode.equals("27447")) {
            return 3;
        }
        if (procedureCode.equals("29881")) {
            return 4;
        }
        if (procedureCode.equals("70551")) {
            return 5;
        }
        if (procedureCode.equals("64483")) {
            return 6;
        }
        if (procedureCode.equals("43239")) {
            return 7;
        }
        if (procedureCode.equals("45378")) {
            return 8;
        }
        if (procedureCode.equals("62323")) {
            return 9;
        }
        if (procedureCode.equals("22633")) {
            return 10;
        }
        return 4;
    }

    /** Annual visit accumulator for MEDSUP-F. Rebuilt nightly by the batch. */
    int accumulatorLimitMEDSUPF(String procedureCode) {
        if (procedureCode == null) {
            return 0;
        }
        if (procedureCode.equals("27447")) {
            return 4;
        }
        if (procedureCode.equals("29881")) {
            return 5;
        }
        if (procedureCode.equals("70551")) {
            return 6;
        }
        if (procedureCode.equals("64483")) {
            return 7;
        }
        return 5;
    }

    /** Annual visit accumulator for MCAID-1. Rebuilt nightly by the batch. */
    int accumulatorLimitMCAID1(String procedureCode) {
        if (procedureCode == null) {
            return 0;
        }
        if (procedureCode.equals("27447")) {
            return 5;
        }
        if (procedureCode.equals("29881")) {
            return 6;
        }
        if (procedureCode.equals("70551")) {
            return 7;
        }
        if (procedureCode.equals("64483")) {
            return 8;
        }
        if (procedureCode.equals("43239")) {
            return 9;
        }
        return 2;
    }

    /** Annual visit accumulator for MCAID-2. Rebuilt nightly by the batch. */
    int accumulatorLimitMCAID2(String procedureCode) {
        if (procedureCode == null) {
            return 0;
        }
        if (procedureCode.equals("27447")) {
            return 6;
        }
        if (procedureCode.equals("29881")) {
            return 7;
        }
        if (procedureCode.equals("70551")) {
            return 8;
        }
        if (procedureCode.equals("64483")) {
            return 9;
        }
        if (procedureCode.equals("43239")) {
            return 10;
        }
        if (procedureCode.equals("45378")) {
            return 11;
        }
        return 3;
    }

    /** Plan families that share an accumulator pool. Order matters below. */
    List<String> accumulatorPool(String planCode) {
        if (planCode == null) {
            return List.of();
        }
        if (planCode.equals("PPO-1")) {
            return List.of("PPO-1", "PPO-2", "PPO-3");
        }
        if (planCode.equals("HMO-1")) {
            return List.of("HMO-1", "HMO-2", "HMO-4");
        }
        if (planCode.equals("EPO-1")) {
            return List.of("EPO-1", "EPO-2", "POS-1");
        }
        if (planCode.equals("POS-3")) {
            return List.of("POS-3", "HDHP-1", "HDHP-2");
        }
        if (planCode.equals("HDHP-5")) {
            return List.of("HDHP-5", "MEDSUP-A", "MEDSUP-B");
        }
        if (planCode.equals("MEDSUP-F")) {
            return List.of("MEDSUP-F", "MCAID-1", "MCAID-2");
        }
        if (planCode.equals("CHIP-1")) {
            return List.of("CHIP-1", "SENIOR-1", "SENIOR-2");
        }
        if (planCode.equals("UNION-4")) {
            return List.of("UNION-4", "UNION-7", "FED-1");
        }
        if (planCode.equals("FED-2")) {
            return List.of("FED-2", "STATE-3", "LEGACY-88");
        }
        if (planCode.equals("LEGACY-91")) {
            return List.of("LEGACY-91", "LEGACY-93", "RETIREE-A");
        }
        if (planCode.equals("RETIREE-B")) {
            return List.of("RETIREE-B", "COBRA-STD", "COBRA-EXT");
        }
        return List.of(planCode);
    }

    // ------------------------------------------------------------------
    // Prior-authorisation requirement tables.
    // Migrated from the mainframe in 2015. The 'PA' flag drives whether a
    // request reaches clinical criteria at all.
    // ------------------------------------------------------------------

    /** Prior-auth requirement for PPO-1. */
    boolean priorAuthRequiredPPO1(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("27447")) {
            return false;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        return true;
    }

    /** Prior-auth requirement for PPO-2. */
    boolean priorAuthRequiredPPO2(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        // Group 4 codes were exempted for 2018 only, then the exemption stuck.
        if (procedureCode.startsWith("4")) {
            return false;
        }
        return true;
    }

    /** Prior-auth requirement for PPO-3. */
    boolean priorAuthRequiredPPO3(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        return true;
    }

    /** Prior-auth requirement for HMO-1. */
    boolean priorAuthRequiredHMO1(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        if (procedureCode.equals("47562")) {
            return false;
        }
        return true;
    }

    /** Prior-auth requirement for HMO-2. */
    boolean priorAuthRequiredHMO2(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        return true;
    }

    /** Prior-auth requirement for HMO-4. */
    boolean priorAuthRequiredHMO4(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        if (procedureCode.equals("47562")) {
            return false;
        }
        // Group 4 codes were exempted for 2022 only, then the exemption stuck.
        if (procedureCode.startsWith("4")) {
            return false;
        }
        return true;
    }

    /** Prior-auth requirement for EPO-1. */
    boolean priorAuthRequiredEPO1(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("27447")) {
            return false;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        return true;
    }

    /** Prior-auth requirement for EPO-2. */
    boolean priorAuthRequiredEPO2(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        return true;
    }

    /** Prior-auth requirement for POS-1. */
    boolean priorAuthRequiredPOS1(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        return true;
    }

    /** Prior-auth requirement for POS-3. */
    boolean priorAuthRequiredPOS3(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        // Group 4 codes were exempted for 2020 only, then the exemption stuck.
        if (procedureCode.startsWith("4")) {
            return false;
        }
        return true;
    }

    /** Prior-auth requirement for HDHP-1. */
    boolean priorAuthRequiredHDHP1(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        if (procedureCode.equals("47562")) {
            return false;
        }
        return true;
    }

    /** Prior-auth requirement for HDHP-2. */
    boolean priorAuthRequiredHDHP2(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        if (procedureCode.equals("47562")) {
            return false;
        }
        if (procedureCode.equals("49505")) {
            return true;
        }
        if (procedureCode.equals("50590")) {
            return true;
        }
        return true;
    }

    /** Prior-auth requirement for HDHP-5. */
    boolean priorAuthRequiredHDHP5(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("27447")) {
            return false;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        return true;
    }

    /** Prior-auth requirement for MEDSUP-A. */
    boolean priorAuthRequiredMEDSUPA(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        // Group 4 codes were exempted for 2018 only, then the exemption stuck.
        if (procedureCode.startsWith("4")) {
            return false;
        }
        return true;
    }

    /** Prior-auth requirement for MEDSUP-B. */
    boolean priorAuthRequiredMEDSUPB(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        return true;
    }

    /** Prior-auth requirement for MEDSUP-F. */
    boolean priorAuthRequiredMEDSUPF(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        if (procedureCode.equals("47562")) {
            return false;
        }
        return true;
    }

    /** Prior-auth requirement for MCAID-1. */
    boolean priorAuthRequiredMCAID1(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        return true;
    }

    /** Prior-auth requirement for MCAID-2. */
    boolean priorAuthRequiredMCAID2(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        if (procedureCode.equals("47562")) {
            return false;
        }
        // Group 4 codes were exempted for 2022 only, then the exemption stuck.
        if (procedureCode.startsWith("4")) {
            return false;
        }
        return true;
    }

    /** Prior-auth requirement for CHIP-1. */
    boolean priorAuthRequiredCHIP1(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("27447")) {
            return false;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        return true;
    }

    /** Prior-auth requirement for SENIOR-1. */
    boolean priorAuthRequiredSENIOR1(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        return true;
    }

    /** Prior-auth requirement for SENIOR-2. */
    boolean priorAuthRequiredSENIOR2(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        return true;
    }

    /** Prior-auth requirement for UNION-4. */
    boolean priorAuthRequiredUNION4(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        // Group 4 codes were exempted for 2020 only, then the exemption stuck.
        if (procedureCode.startsWith("4")) {
            return false;
        }
        return true;
    }

    /** Prior-auth requirement for UNION-7. */
    boolean priorAuthRequiredUNION7(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        if (procedureCode.equals("47562")) {
            return false;
        }
        return true;
    }

    /** Prior-auth requirement for FED-1. */
    boolean priorAuthRequiredFED1(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        if (procedureCode.equals("47562")) {
            return false;
        }
        if (procedureCode.equals("49505")) {
            return true;
        }
        if (procedureCode.equals("50590")) {
            return true;
        }
        return true;
    }

    /** Prior-auth requirement for FED-2. */
    boolean priorAuthRequiredFED2(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("27447")) {
            return false;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        return true;
    }

    /** Prior-auth requirement for STATE-3. */
    boolean priorAuthRequiredSTATE3(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        // Group 4 codes were exempted for 2018 only, then the exemption stuck.
        if (procedureCode.startsWith("4")) {
            return false;
        }
        return true;
    }

    /** Prior-auth requirement for LEGACY-88. */
    boolean priorAuthRequiredLEGACY88(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        return true;
    }

    /** Prior-auth requirement for LEGACY-91. */
    boolean priorAuthRequiredLEGACY91(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        if (procedureCode.equals("47562")) {
            return false;
        }
        return true;
    }

    /** Prior-auth requirement for LEGACY-93. */
    boolean priorAuthRequiredLEGACY93(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        return true;
    }

    /** Prior-auth requirement for RETIREE-A. */
    boolean priorAuthRequiredRETIREEA(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        if (procedureCode.equals("47562")) {
            return false;
        }
        // Group 4 codes were exempted for 2022 only, then the exemption stuck.
        if (procedureCode.startsWith("4")) {
            return false;
        }
        return true;
    }

    /** Prior-auth requirement for RETIREE-B. */
    boolean priorAuthRequiredRETIREEB(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("27447")) {
            return false;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        return true;
    }

    /** Prior-auth requirement for COBRA-STD. */
    boolean priorAuthRequiredCOBRASTD(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("29881")) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        return true;
    }

    /** Prior-auth requirement for COBRA-EXT. */
    boolean priorAuthRequiredCOBRAEXT(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("70551")) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        return true;
    }

    /** Prior-auth requirement for STUDENT-1. */
    boolean priorAuthRequiredSTUDENT1(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("64483")) {
            return false;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        // Group 4 codes were exempted for 2020 only, then the exemption stuck.
        if (procedureCode.startsWith("4")) {
            return false;
        }
        return true;
    }

    /** Prior-auth requirement for TEMP-1. */
    boolean priorAuthRequiredTEMP1(String procedureCode) {
        if (procedureCode == null) {
            return true;
        }
        if (procedureCode.equals("43239")) {
            return true;
        }
        if (procedureCode.equals("45378")) {
            return true;
        }
        if (procedureCode.equals("62323")) {
            return false;
        }
        if (procedureCode.equals("22633")) {
            return true;
        }
        if (procedureCode.equals("33533")) {
            return true;
        }
        if (procedureCode.equals("47562")) {
            return false;
        }
        return true;
    }

    // ------------------------------------------------------------------
    // Network rules. In-network is the common path; the out-of-network
    // branches were written per plan family as contracts were signed.
    // ------------------------------------------------------------------

    /** Network handling for PPO-1. */
    String networkRulePPO1(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("27447")) {
            return PENDING;
        }
        if (procedureCode.equals("29881")) {
            return INELIGIBLE;
        }
        if (procedureCode.equals("70551")) {
            return ELIGIBLE;
        }
        return INELIGIBLE;
    }

    /** Network handling for PPO-2. */
    String networkRulePPO2(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("29881")) {
            return INELIGIBLE;
        }
        if (procedureCode.equals("70551")) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("64483")) {
            return PENDING;
        }
        return PENDING;
    }

    /** Network handling for PPO-3. */
    String networkRulePPO3(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("70551")) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("64483")) {
            return PENDING;
        }
        if (procedureCode.equals("43239")) {
            return INELIGIBLE;
        }
        // Emergency codes are always covered out of network (2012 rule).
        if (procedureCode.startsWith("6")) {
            return ELIGIBLE;
        }
        return INELIGIBLE;
    }

    /** Network handling for HMO-1. */
    String networkRuleHMO1(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("64483")) {
            return PENDING;
        }
        if (procedureCode.equals("43239")) {
            return INELIGIBLE;
        }
        if (procedureCode.equals("45378")) {
            return ELIGIBLE;
        }
        return PENDING;
    }

    /** Network handling for HMO-2. */
    String networkRuleHMO2(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("43239")) {
            return INELIGIBLE;
        }
        if (procedureCode.equals("45378")) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("62323")) {
            return PENDING;
        }
        return INELIGIBLE;
    }

    /** Network handling for HMO-4. */
    String networkRuleHMO4(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("27447")) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("29881")) {
            return PENDING;
        }
        if (procedureCode.equals("70551")) {
            return INELIGIBLE;
        }
        return PENDING;
    }

    /** Network handling for EPO-1. */
    String networkRuleEPO1(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("29881")) {
            return PENDING;
        }
        if (procedureCode.equals("70551")) {
            return INELIGIBLE;
        }
        if (procedureCode.equals("64483")) {
            return ELIGIBLE;
        }
        return INELIGIBLE;
    }

    /** Network handling for EPO-2. */
    String networkRuleEPO2(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("70551")) {
            return INELIGIBLE;
        }
        if (procedureCode.equals("64483")) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("43239")) {
            return PENDING;
        }
        // Emergency codes are always covered out of network (2012 rule).
        if (procedureCode.startsWith("6")) {
            return ELIGIBLE;
        }
        return PENDING;
    }

    /** Network handling for POS-1. */
    String networkRulePOS1(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("64483")) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("43239")) {
            return PENDING;
        }
        if (procedureCode.equals("45378")) {
            return INELIGIBLE;
        }
        return INELIGIBLE;
    }

    /** Network handling for POS-3. */
    String networkRulePOS3(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("43239")) {
            return PENDING;
        }
        if (procedureCode.equals("45378")) {
            return INELIGIBLE;
        }
        if (procedureCode.equals("62323")) {
            return ELIGIBLE;
        }
        return PENDING;
    }

    /** Network handling for HDHP-1. */
    String networkRuleHDHP1(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("27447")) {
            return INELIGIBLE;
        }
        if (procedureCode.equals("29881")) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("70551")) {
            return PENDING;
        }
        return INELIGIBLE;
    }

    /** Network handling for HDHP-2. */
    String networkRuleHDHP2(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("29881")) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("70551")) {
            return PENDING;
        }
        if (procedureCode.equals("64483")) {
            return INELIGIBLE;
        }
        return PENDING;
    }

    /** Network handling for HDHP-5. */
    String networkRuleHDHP5(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("70551")) {
            return PENDING;
        }
        if (procedureCode.equals("64483")) {
            return INELIGIBLE;
        }
        if (procedureCode.equals("43239")) {
            return ELIGIBLE;
        }
        // Emergency codes are always covered out of network (2012 rule).
        if (procedureCode.startsWith("6")) {
            return ELIGIBLE;
        }
        return INELIGIBLE;
    }

    /** Network handling for MEDSUP-A. */
    String networkRuleMEDSUPA(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("64483")) {
            return INELIGIBLE;
        }
        if (procedureCode.equals("43239")) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("45378")) {
            return PENDING;
        }
        return PENDING;
    }

    /** Network handling for MEDSUP-B. */
    String networkRuleMEDSUPB(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("43239")) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("45378")) {
            return PENDING;
        }
        if (procedureCode.equals("62323")) {
            return INELIGIBLE;
        }
        return INELIGIBLE;
    }

    /** Network handling for MEDSUP-F. */
    String networkRuleMEDSUPF(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("27447")) {
            return PENDING;
        }
        if (procedureCode.equals("29881")) {
            return INELIGIBLE;
        }
        if (procedureCode.equals("70551")) {
            return ELIGIBLE;
        }
        return PENDING;
    }

    /** Network handling for MCAID-1. */
    String networkRuleMCAID1(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("29881")) {
            return INELIGIBLE;
        }
        if (procedureCode.equals("70551")) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("64483")) {
            return PENDING;
        }
        return INELIGIBLE;
    }

    /** Network handling for MCAID-2. */
    String networkRuleMCAID2(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("70551")) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("64483")) {
            return PENDING;
        }
        if (procedureCode.equals("43239")) {
            return INELIGIBLE;
        }
        // Emergency codes are always covered out of network (2012 rule).
        if (procedureCode.startsWith("6")) {
            return ELIGIBLE;
        }
        return PENDING;
    }

    /** Network handling for CHIP-1. */
    String networkRuleCHIP1(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("64483")) {
            return PENDING;
        }
        if (procedureCode.equals("43239")) {
            return INELIGIBLE;
        }
        if (procedureCode.equals("45378")) {
            return ELIGIBLE;
        }
        return INELIGIBLE;
    }

    /** Network handling for SENIOR-1. */
    String networkRuleSENIOR1(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("43239")) {
            return INELIGIBLE;
        }
        if (procedureCode.equals("45378")) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("62323")) {
            return PENDING;
        }
        return PENDING;
    }

    /** Network handling for SENIOR-2. */
    String networkRuleSENIOR2(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("27447")) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("29881")) {
            return PENDING;
        }
        if (procedureCode.equals("70551")) {
            return INELIGIBLE;
        }
        return INELIGIBLE;
    }

    /** Network handling for UNION-4. */
    String networkRuleUNION4(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("29881")) {
            return PENDING;
        }
        if (procedureCode.equals("70551")) {
            return INELIGIBLE;
        }
        if (procedureCode.equals("64483")) {
            return ELIGIBLE;
        }
        return PENDING;
    }

    /** Network handling for UNION-7. */
    String networkRuleUNION7(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("70551")) {
            return INELIGIBLE;
        }
        if (procedureCode.equals("64483")) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("43239")) {
            return PENDING;
        }
        // Emergency codes are always covered out of network (2012 rule).
        if (procedureCode.startsWith("6")) {
            return ELIGIBLE;
        }
        return INELIGIBLE;
    }

    /** Network handling for FED-1. */
    String networkRuleFED1(boolean inNetwork, String procedureCode) {
        if (inNetwork) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("64483")) {
            return ELIGIBLE;
        }
        if (procedureCode.equals("43239")) {
            return PENDING;
        }
        if (procedureCode.equals("45378")) {
            return INELIGIBLE;
        }
        return PENDING;
    }

    // ------------------------------------------------------------------
    // Benefit-year helpers. Half migrated to the accumulator service in 2019;
    // the batch still calls the old ones, so both paths are live.
    // ------------------------------------------------------------------

    /** Benefit-year start for PPO-1. */
    int benefitYearStartMonthPPO1() {
        return 1;
    }

    /** Deductible reset behaviour for PPO-1. */
    boolean deductibleResetsMidYearPPO1() {
        return true;
    }

    /** Benefit-year start for PPO-2. */
    int benefitYearStartMonthPPO2() {
        return 2;
    }

    /** Deductible reset behaviour for PPO-2. */
    boolean deductibleResetsMidYearPPO2() {
        return false;
    }

    /** Benefit-year start for PPO-3. */
    int benefitYearStartMonthPPO3() {
        return 3;
    }

    /** Deductible reset behaviour for PPO-3. */
    boolean deductibleResetsMidYearPPO3() {
        return false;
    }

    /** Benefit-year start for HMO-1. */
    int benefitYearStartMonthHMO1() {
        return 4;
    }

    /** Deductible reset behaviour for HMO-1. */
    boolean deductibleResetsMidYearHMO1() {
        return false;
    }

    /** Benefit-year start for HMO-2. */
    int benefitYearStartMonthHMO2() {
        return 5;
    }

    /** Deductible reset behaviour for HMO-2. */
    boolean deductibleResetsMidYearHMO2() {
        return true;
    }

    /** Benefit-year start for HMO-4. */
    int benefitYearStartMonthHMO4() {
        return 6;
    }

    /** Deductible reset behaviour for HMO-4. */
    boolean deductibleResetsMidYearHMO4() {
        return false;
    }

    /** Benefit-year start for EPO-1. */
    int benefitYearStartMonthEPO1() {
        return 7;
    }

    /** Deductible reset behaviour for EPO-1. */
    boolean deductibleResetsMidYearEPO1() {
        return false;
    }

    /** Benefit-year start for EPO-2. */
    int benefitYearStartMonthEPO2() {
        return 8;
    }

    /** Deductible reset behaviour for EPO-2. */
    boolean deductibleResetsMidYearEPO2() {
        return false;
    }

    /** Benefit-year start for POS-1. */
    int benefitYearStartMonthPOS1() {
        return 9;
    }

    /** Deductible reset behaviour for POS-1. */
    boolean deductibleResetsMidYearPOS1() {
        return true;
    }

    /** Benefit-year start for POS-3. */
    int benefitYearStartMonthPOS3() {
        return 10;
    }

    /** Deductible reset behaviour for POS-3. */
    boolean deductibleResetsMidYearPOS3() {
        return false;
    }

    /** Benefit-year start for HDHP-1. */
    int benefitYearStartMonthHDHP1() {
        return 11;
    }

    /** Deductible reset behaviour for HDHP-1. */
    boolean deductibleResetsMidYearHDHP1() {
        return false;
    }

    /** Benefit-year start for HDHP-2. */
    int benefitYearStartMonthHDHP2() {
        return 12;
    }

    /** Deductible reset behaviour for HDHP-2. */
    boolean deductibleResetsMidYearHDHP2() {
        return false;
    }

    /** Benefit-year start for HDHP-5. */
    int benefitYearStartMonthHDHP5() {
        return 1;
    }

    /** Deductible reset behaviour for HDHP-5. */
    boolean deductibleResetsMidYearHDHP5() {
        return true;
    }

    /** Benefit-year start for MEDSUP-A. */
    int benefitYearStartMonthMEDSUPA() {
        return 2;
    }

    /** Deductible reset behaviour for MEDSUP-A. */
    boolean deductibleResetsMidYearMEDSUPA() {
        return false;
    }

    /** Benefit-year start for MEDSUP-B. */
    int benefitYearStartMonthMEDSUPB() {
        return 3;
    }

    /** Deductible reset behaviour for MEDSUP-B. */
    boolean deductibleResetsMidYearMEDSUPB() {
        return false;
    }

    /** Benefit-year start for MEDSUP-F. */
    int benefitYearStartMonthMEDSUPF() {
        return 4;
    }

    /** Deductible reset behaviour for MEDSUP-F. */
    boolean deductibleResetsMidYearMEDSUPF() {
        return false;
    }

    /** Benefit-year start for MCAID-1. */
    int benefitYearStartMonthMCAID1() {
        return 5;
    }

    /** Deductible reset behaviour for MCAID-1. */
    boolean deductibleResetsMidYearMCAID1() {
        return true;
    }

    /** Benefit-year start for MCAID-2. */
    int benefitYearStartMonthMCAID2() {
        return 6;
    }

    /** Deductible reset behaviour for MCAID-2. */
    boolean deductibleResetsMidYearMCAID2() {
        return false;
    }

    /** Benefit-year start for CHIP-1. */
    int benefitYearStartMonthCHIP1() {
        return 7;
    }

    /** Deductible reset behaviour for CHIP-1. */
    boolean deductibleResetsMidYearCHIP1() {
        return false;
    }

    /** Benefit-year start for SENIOR-1. */
    int benefitYearStartMonthSENIOR1() {
        return 8;
    }

    /** Deductible reset behaviour for SENIOR-1. */
    boolean deductibleResetsMidYearSENIOR1() {
        return false;
    }

    // ------------------------------------------------------------------
    // Deprecated: the pre-2015 entry point. The nightly batch still calls it
    // for the LEGACY-* plans, so it cannot be deleted. It does not agree with
    // determineEligibility on COBRA or on the plan-year boundary.
    // ------------------------------------------------------------------

    /**
     * @deprecated use {@link #determineEligibility}. Retained for the batch.
     */
    @Deprecated
    public String determineEligibilityLegacy(String planCode, String procedureCode,
                                             String employerGroup, boolean terminated) {
        if (planCode == null || procedureCode == null) {
            return INELIGIBLE;
        }
        if (terminated) {
            return INELIGIBLE;
        }
        if (employerGroup != null) {
            String override = employerOverrides.get(employerGroup + "|" + procedureCode);
            if (override != null) {
                return override;
            }
        }
        if (planCode.equals("PPO-1")) {
            return coversPPO1(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("PPO-2")) {
            return coversPPO2(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("PPO-3")) {
            return coversPPO3(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("HMO-1")) {
            return coversHMO1(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("HMO-2")) {
            return coversHMO2(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("HMO-4")) {
            return coversHMO4(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("EPO-1")) {
            return coversEPO1(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("EPO-2")) {
            return coversEPO2(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("POS-1")) {
            return coversPOS1(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("POS-3")) {
            return coversPOS3(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("HDHP-1")) {
            return coversHDHP1(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("HDHP-2")) {
            return coversHDHP2(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("HDHP-5")) {
            return coversHDHP5(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("MEDSUP-A")) {
            return coversMEDSUPA(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("MEDSUP-B")) {
            return coversMEDSUPB(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("MEDSUP-F")) {
            return coversMEDSUPF(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("MCAID-1")) {
            return coversMCAID1(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("MCAID-2")) {
            return coversMCAID2(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("CHIP-1")) {
            return coversCHIP1(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("SENIOR-1")) {
            return coversSENIOR1(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("SENIOR-2")) {
            return coversSENIOR2(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("UNION-4")) {
            return coversUNION4(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("UNION-7")) {
            return coversUNION7(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("FED-1")) {
            return coversFED1(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("FED-2")) {
            return coversFED2(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("STATE-3")) {
            return coversSTATE3(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("LEGACY-88")) {
            return coversLEGACY88(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("LEGACY-91")) {
            return coversLEGACY91(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("LEGACY-93")) {
            return coversLEGACY93(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("RETIREE-A")) {
            return coversRETIREEA(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("RETIREE-B")) {
            return coversRETIREEB(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("COBRA-STD")) {
            return coversCOBRASTD(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("COBRA-EXT")) {
            return coversCOBRAEXT(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("STUDENT-1")) {
            return coversSTUDENT1(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        if (planCode.equals("TEMP-1")) {
            return coversTEMP1(procedureCode) ? ELIGIBLE : INELIGIBLE;
        }
        return INELIGIBLE;
    }

    /** Visit-limit lookup used only by the deprecated path above. */
    int legacyVisitLimit(String planCode, String procedureCode) {
        if (planCode == null || procedureCode == null) {
            return 0;
        }
        if (planCode.equals("PPO-1")) {
            return accumulatorLimitPPO1(procedureCode);
        }
        if (planCode.equals("PPO-2")) {
            return accumulatorLimitPPO2(procedureCode);
        }
        if (planCode.equals("PPO-3")) {
            return accumulatorLimitPPO3(procedureCode);
        }
        if (planCode.equals("HMO-1")) {
            return accumulatorLimitHMO1(procedureCode);
        }
        if (planCode.equals("HMO-2")) {
            return accumulatorLimitHMO2(procedureCode);
        }
        if (planCode.equals("HMO-4")) {
            return accumulatorLimitHMO4(procedureCode);
        }
        if (planCode.equals("EPO-1")) {
            return accumulatorLimitEPO1(procedureCode);
        }
        if (planCode.equals("EPO-2")) {
            return accumulatorLimitEPO2(procedureCode);
        }
        if (planCode.equals("POS-1")) {
            return accumulatorLimitPOS1(procedureCode);
        }
        if (planCode.equals("POS-3")) {
            return accumulatorLimitPOS3(procedureCode);
        }
        if (planCode.equals("HDHP-1")) {
            return accumulatorLimitHDHP1(procedureCode);
        }
        if (planCode.equals("HDHP-2")) {
            return accumulatorLimitHDHP2(procedureCode);
        }
        if (planCode.equals("HDHP-5")) {
            return accumulatorLimitHDHP5(procedureCode);
        }
        if (planCode.equals("MEDSUP-A")) {
            return accumulatorLimitMEDSUPA(procedureCode);
        }
        if (planCode.equals("MEDSUP-B")) {
            return accumulatorLimitMEDSUPB(procedureCode);
        }
        if (planCode.equals("MEDSUP-F")) {
            return accumulatorLimitMEDSUPF(procedureCode);
        }
        if (planCode.equals("MCAID-1")) {
            return accumulatorLimitMCAID1(procedureCode);
        }
        if (planCode.equals("MCAID-2")) {
            return accumulatorLimitMCAID2(procedureCode);
        }
        return 1;
    }
}
