Regarding AI/LLM usage:

First, I sent the application description with the readme with additional info to github copilot:
- description for the AI ​​regarding the graphic files, so that it knew about the road tiles and that they should be rotated depending on whether there were other roads around it (i noted original position and that they should be rotated 0,90,180 or 270 degrees)
- I described what format I want the frame sent via the API to be
- i noted that is should build backend with node.js nad frontend with react typescript
- i noted that i want the cabana image to bo formatted via css based on availability

Ai provided me with the first build of the app with separated frontend and backend. I worked but there was problem with rotation of the road tiles. It also lack the color for cabana availability.

I asked AI to fix the colors of cabana and the road rotation.

Ai provided me with the second build. But the problems where still present. I manually corrected the rotation values in backend. Then a i asked chatgpt about the filters for color of cabana. I adjusted the css based on chatgpt and it worked.

Next i noticed there was an issue with padding between cells. I manually adjusted css. Then i asked github copilot to adjust the app so before booking it would check if specific person already booked other cabana. If other cabana is booked and should remove the previous booking and only left the new book for that person. Ai successfully adjusted the code.

Then i asked github copilot to create automated test. Initially, it had a problem and got stuck in a loop. But after stopping and asking for error corrections, it created the tests correctly.

After that i tweaked the css and frontend manually (with some AI snippets form github copilot). I also added different color (yellow) for currently selected cabana.