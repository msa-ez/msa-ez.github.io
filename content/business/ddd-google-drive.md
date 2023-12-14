---
description: ''
sidebar: 'started'
---

# Google Drive Example

## Google Drive Examples

### Scenario

1. User uploads a file.
 
2. Whenever a file is uploaded, the location of the file is being indexed by the name of the file.
 
3. If uploaded file is a video, the file is getting video-streamed(the result is the video streaming service url).
 
4. When the file is uploaded or it is created as a video, the user who uploaded the file gets notification.
 
5. The dashboard displays the status of uploaded files(size, name, indexing status, upload status, video url).

The List of Bounded Contexts: 
 
1. dashboard
2. drive
3. indexer
4. video processing
5. notification