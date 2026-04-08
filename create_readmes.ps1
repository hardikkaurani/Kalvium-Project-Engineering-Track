$milestones = 'Milestone 02','Milestone 04','Milestone 05','Milestone 06','Milestone_08','Milestone 09'
foreach ($milestone in $milestones) {
    if (Test-Path $milestone) {
        $dirs = Get-ChildItem -Path $milestone -Directory
        foreach ($dir in $dirs) {
            $path = Join-Path $dir.FullName 'README.md'
            if (-not (Test-Path $path)) {
                $title = $dir.Name -replace '-', ' ' -replace '_', ' '
                $content = "# $title`r`n`r`nBrief description of what the challenge is about."
                $content | Out-File -FilePath $path -Encoding UTF8
                Write-Host "Created: $path"
            }
        }
    }
}
