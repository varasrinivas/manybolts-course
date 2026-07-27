package com.meridiancare.priorauth.domain;

import com.meridiancare.priorauth.annotation.PhiField;

import java.time.LocalDate;

/** A covered member. Everything on this type is protected health information. */
public final class Member {

    private final String id;
    private final LocalDate dateOfBirth;
    private final String planCode;
    private final String employerGroup;
    private final MemberStatus status;
    private final LocalDate coverageStart;
    private final LocalDate coverageEnd;

    public Member(String id, LocalDate dateOfBirth, String planCode, String employerGroup,
                  MemberStatus status, LocalDate coverageStart, LocalDate coverageEnd) {
        this.id = id;
        this.dateOfBirth = dateOfBirth;
        this.planCode = planCode;
        this.employerGroup = employerGroup;
        this.status = status;
        this.coverageStart = coverageStart;
        this.coverageEnd = coverageEnd;
    }

    @PhiField
    public String getId() {
        return id;
    }

    @PhiField
    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public String getPlanCode() {
        return planCode;
    }

    public String getEmployerGroup() {
        return employerGroup;
    }

    public MemberStatus getStatus() {
        return status;
    }

    public LocalDate getCoverageStart() {
        return coverageStart;
    }

    public LocalDate getCoverageEnd() {
        return coverageEnd;
    }

    public enum MemberStatus { ACTIVE, TERMINATED, COBRA, RETIREE, DEPENDENT }
}
