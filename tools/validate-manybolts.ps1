<#
.SYNOPSIS
  Content validation rules for "Many Bolts, One Codebase" (blueprint §12).
.DESCRIPTION
  Rules 1-8. Run after tools/validate.py, per module, before /clear.
  Failures block. Warnings are author judgement - read rule 3 warnings especially.
.EXAMPLE
  pwsh tools/validate-manybolts.ps1 -Module M05
  pwsh tools/validate-manybolts.ps1 -All
#>

param(
    [string]$Module,
    [switch]$All,
    [string]$PlayerPath   = "course/index.html",
    [string]$GlossaryPath = "course/glossary.md"
)

$ErrorActionPreference = "Stop"
$script:Failures = @()
$script:Warnings = @()
function Fail($r,$m){ $script:Failures += "[$r] $m" }
function Warn($r,$m){ $script:Warnings += "[$r] $m" }

$AllModules   = 0..21 | ForEach-Object { "M{0:D2}" -f $_ }
$HonestLimit  = @("M05","M09","M11","M17","M19","M20")   # rule 8
$NoTeamNames  = @("M18","M20")                            # rule 6
$OtherCourses = @("Sprint Teams","76-Day","Lakeview","10x Toolkit","Many Bolts prerequisite")

$Targets = if ($All) { $AllModules } elseif ($Module) { @($Module) } else {
    Write-Host "Specify -Module <id> or -All" -ForegroundColor Yellow; exit 2
}

if (-not (Test-Path $PlayerPath)) { Write-Host "Player not found: $PlayerPath" -ForegroundColor Red; exit 2 }
$player   = Get-Content $PlayerPath -Raw -Encoding UTF8
$glossary = if (Test-Path $GlossaryPath) { Get-Content $GlossaryPath -Raw -Encoding UTF8 } else { "" }

function Get-ModuleBlock($id){
    $m = [regex]::Match($player, "(?s)/\* <!--\s*MOD:$id\s*--> \*/(.*?)/\* <!--\s*/MOD:$id\s*--> \*/")
    if (-not $m.Success) { return $null }
    return $m.Groups[1].Value
}

foreach ($id in $Targets) {

    if ($id -notin $AllModules) { Warn "SCOPE" "$id is not a module in this course; skipping."; continue }

    $block = Get-ModuleBlock $id
    if ($null -eq $block -or -not $block.Trim()) {
        if ($All) { continue }                       # -All skips unbuilt slots quietly
        Fail "EXISTS" "$id has no content between its MOD markers."; continue
    }

    # ---- Rule 1: cold start -------------------------------------------------
    foreach ($course in $OtherCourses) {
        if ($block -match [regex]::Escape($course)) {
            if ($block -notmatch "(?i)optional[^<]{0,120}$([regex]::Escape($course))|$([regex]::Escape($course))[^<]{0,120}optional") {
                Fail "R1" "$id references another course ('$course') without marking it optional."
            }
        }
    }

    # ---- Rule 2: contention class ------------------------------------------
    if ($block -notmatch "contentionClass\s*:\s*\[\s*['""](code|validator|infrastructure)") {
        Fail "R2" "$id does not declare a contentionClass."
    }
    if ($id -eq "M03") {
        foreach ($cc in @("code","validator","infrastructure")) {
            if ($block -notmatch "contentionClass[^\]]*$cc") { Fail "R2" "M03 must declare all three contention classes (missing '$cc')." }
        }
    }

    # ---- Rule 3: scale-claim qualification (warning) -----------------------
    $claims = [regex]::Matches($block, '(?i)(a bolt is|bolts are|the mob |mob elaboration|mob construction|validation checkpoint|unit of work is)[^.<]{0,200}\.')
    foreach ($c in $claims) {
        $s = $c.Value
        if ($s -notmatch '(?i)(multi-mob|at scale|one mob|single mob|concurrent|shared|per mob|second mob|contention|queue|five mobs|three mobs)') {
            Warn "R3" "$id unqualified scale claim -> `"$(($s -replace '\s+',' ').Trim())`""
        }
    }

    # ---- Rule 4: planted defect reference ----------------------------------
    if ($block -match 'lab\s*:\s*\{') {
        if ($block -notmatch 'PD-(1[0-2]|[1-9])\b' -and $block -notmatch 'PD-NONE') {
            Fail "R4" "$id lab references no planted defect (PD-1..PD-12) and does not declare PD-NONE."
        }
        if ($block -match 'PD-NONE' -and $block -notmatch '(?i)(because|reason|justif)') {
            Warn "R4" "$id declares PD-NONE without a visible justification."
        }
    }

    # ---- Rule 5: dual-path parity ------------------------------------------
    if ($block -match 'lab\s*:\s*\{') {
        $agnostic    = $block -match "engine\s*:\s*['""]ENGINE-AGNOSTIC"
        $comparative = $block -match "engine\s*:\s*['""]ENGINE-COMPARATIVE"
        if ($comparative -and $id -ne "M13") {
            Fail "R5" "$id uses ENGINE-COMPARATIVE, which is reserved for M13."
        }
        if (-not $agnostic) {
            if ($block -notmatch "\ba\s*:\s*``" -or $block -notmatch "\bb\s*:\s*``") {
                Fail "R5" "$id lab is missing a Path A or Path B panel (and is not ENGINE-AGNOSTIC)."
            }
        }
    }

    # ---- Rule 6: comparison trap -------------------------------------------
    if ($id -in $NoTeamNames) {
        foreach ($t in [regex]::Matches($block, '(?i)\b(team|mob|squad)\s+(alpha|bravo|charlie|delta|echo|one|two|three|[a-c]|[1-3])\b')) {
            Fail "R6" "$id contains a per-team identifier: `"$($t.Value)`" (including sample data)."
        }
    }

    # ---- Rule 7: glossary coverage (warning) -------------------------------
    $bolded = [regex]::Matches($block, '<strong>([^<]{4,60})</strong>') |
              ForEach-Object { $_.Groups[1].Value.Trim().ToLower() } | Select-Object -Unique
    foreach ($term in $bolded) {
        $clean = ($term -replace '[^\w\s\u2013\u2014-]','').Trim()
        if ($clean.Length -lt 4) { continue }
        if ($glossary -notmatch [regex]::Escape($clean)) {
            Warn "R7" "$id bolded term not in glossary -> `"$clean`""
        }
    }

    # ---- Rule 8: honest-limit section --------------------------------------
    if ($id -in $HonestLimit) {
        if ($block -notmatch 'callout\s+honest-limit') {
            Fail "R8" "$id must contain a <div class=`"callout honest-limit`"> section stating where the practice or argument stops."
        } else {
            $hl = [regex]::Match($block, '(?s)callout honest-limit(.{0,900})')
            if ($hl.Success -and $hl.Groups[1].Value.Length -lt 180) {
                Warn "R8" "$id honest-limit section is very short - check it states a real limit rather than a caveat."
            }
        }
    }
}

Write-Host ""
Write-Host "Many Bolts validation - $($Targets -join ', ')" -ForegroundColor Cyan
Write-Host ("-" * 62)

if ($script:Warnings.Count -gt 0) {
    Write-Host "WARNINGS ($($script:Warnings.Count))" -ForegroundColor Yellow
    $script:Warnings | ForEach-Object { Write-Host "  $_" -ForegroundColor DarkYellow }
    Write-Host ""
}
if ($script:Failures.Count -gt 0) {
    Write-Host "FAILURES ($($script:Failures.Count))" -ForegroundColor Red
    $script:Failures | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
    Write-Host ""
    Write-Host "FAIL" -ForegroundColor Red
    exit 1
}
Write-Host "PASS" -ForegroundColor Green
if ($script:Warnings.Count -gt 0) { Write-Host "(rule 3 warnings are the ones worth reading)" -ForegroundColor DarkGray }
exit 0
