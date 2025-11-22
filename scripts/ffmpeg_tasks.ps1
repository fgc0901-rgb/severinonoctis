# FFmpeg Utility Functions (PowerShell)
# Requires ffmpeg in PATH

function Convert-ToMP4 {
  param([string]$Input,[string]$Output)
  ffmpeg -y -i $Input -c copy $Output
}

function Extract-Segment {
  param([string]$Input,[string]$Start,[string]$End,[string]$Output)
  ffmpeg -y -i $Input -ss $Start -to $End -c copy $Output
}

function Normalize-Audio {
  param([string]$Input,[string]$Output)
  ffmpeg -y -i $Input -af "loudnorm=I=-16:LRA=11:TP=-1.5" -c:v copy $Output
}

function Generate-Vertical {
  param([string]$Input,[string]$Output)
  # Crop center for 9:16 from 16:9 1920x1080 -> 607x1080 then scale up
  ffmpeg -y -i $Input -filter:v "crop=607:1080:(1920-607)/2:0,scale=1080:1920" -c:a copy $Output
}

function Burn-Subtitles {
  param([string]$Input,[string]$Srt,[string]$Output)
  ffmpeg -y -i $Input -vf subtitles=$Srt -c:a copy $Output
}

function Auto-CutList {
  param([string]$Input,[string]$MarkerFile)
  # MarkerFile format: start,end,output
  foreach($line in Get-Content $MarkerFile){
    $parts = $line.Split(',')
    if($parts.Length -eq 3){
      Extract-Segment -Input $Input -Start $parts[0] -End $parts[1] -Output $parts[2]
    }
  }
}

# Example usage:
# Convert-ToMP4 input.mkv output.mp4
# Extract-Segment master.mp4 00:01:00 00:01:20 corte1.mp4
# Normalize-Audio corte1.mp4 corte1_norm.mp4
# Generate-Vertical master.mp4 vertical_tiktok.mp4
# Burn-Subtitles master.mp4 legenda.srt master_leg.mp4
