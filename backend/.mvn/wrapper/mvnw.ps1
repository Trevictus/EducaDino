<# : batch script portion
@echo off
setlocal
set MVNW_SCRIPT=%~f0
powershell -noprofile -executionpolicy bypass -file "%MVNW_SCRIPT%" %*
exit /b %ERRORLEVEL%
#>

# Maven Wrapper PowerShell Script
$scriptDir = Split-Path -Parent $PSCommandPath
$propertiesPath = Join-Path $scriptDir ".mvn\wrapper\maven-wrapper.properties"

# Read properties
$properties = @{}
if (Test-Path $propertiesPath) {
    Get-Content $propertiesPath | ForEach-Object {
        if ($_ -match "^([^=]+)=(.*)$") {
            $properties[$matches[1]] = $matches[2]
        }
    }
}

$distributionUrl = $properties["distributionUrl"]
if (-not $distributionUrl) {
    $distributionUrl = "https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip"
}

# Setup paths
$mavenHome = Join-Path $env:USERPROFILE ".m2\wrapper\dists"
$zipName = [System.IO.Path]::GetFileName($distributionUrl)
$dirName = $zipName -replace "\.zip$", ""
$mavenDir = Join-Path $mavenHome $dirName
$mvnExe = Join-Path $mavenDir "bin\mvn.cmd"

# Download and extract if needed
if (-not (Test-Path $mvnExe)) {
    Write-Host "Downloading Maven from $distributionUrl..."

    if (-not (Test-Path $mavenHome)) {
        New-Item -ItemType Directory -Path $mavenHome -Force | Out-Null
    }

    $zipPath = Join-Path $mavenHome $zipName

    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $distributionUrl -OutFile $zipPath

    Write-Host "Extracting Maven..."
    Expand-Archive -Path $zipPath -DestinationPath $mavenHome -Force
    Remove-Item $zipPath

    Write-Host "Maven installed to $mavenDir"
}

# Run Maven
& $mvnExe $args
exit $LASTEXITCODE
