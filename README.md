# Bad Roads

## Workflow

1. Clone git repository
2. Make a new branch with a name of your feature/fix
3. Work on your branch (but don't rebase commits from master)
4. Make a Pull Request
5. Ask somebody to review and merge it
6. Resolve conflicts
7. Test and be happy ;)

### How to install ionic

http://ionicframework.com/getting-started/

### Technologies used

- Angular
- Ionic
- NPM
- Bower
- OpenLayers

## Todo

- [ ] Prepare workspace
- [x] Define workflow
- [ ] Prepare tickets
- [ ] Run app on phone
- [ ] Have fun

## App concept

An app which tracks possible danger zones (bad parts) of the road using built-in phone accelerometer,
and maps the acquired data to the location at the map using GPS.

In future it is possible to show the map with dangerous spots for the user, analyse the best routes to the destination,
and also notify the user about an approaching bad part of the road.

Peace for the roads.  
Peace for the car health.  
Peace to our wallets.

### Use case

- Install app on Android/iOS
- Run
- Attach your phone inside a car
- Watch as it tracks the bad parts of the road in the real time

### Basic feature overview

- Track GPS data
  - Read current location
- Process accelerometer data
  - Track a movement in space
  - Calculate if the movement matches a model of a dangerous one
- If yes, connect current location data with the data about a movement
- Notify user about a detection of a possible danger zone

## Name ideas

- CarBeat Monitor (analogy to the Heartbeat Monitor)
