const CHECK_BAIT_INTERVAL = 1000;
class FishManager {
    constructor(scene, water) {
        this.scene = scene; // Storing the Phaser scene to access it later
        this.water = water; // Storing the water boundaries to access it later
        this.fishes = []; // An array to hold the fish sprites
        this.accumulatedTime = 0;
    }

    createFish(amount) {
        
            for (let i = 0; i < amount; i++) {
                // Generate a random x coordinate within the water boundaries
                let x = this.water.x + Math.random() * this.water.width;
    
                // Generate a random y coordinate within the water boundaries
                let y = this.water.y + Math.random() * this.water.height;
    
                
                //now create the fish within that location
                let fish = new Fish(this.scene, this.water, x, y, 'fish');
                
                this.fishes.push(fish); // Store the fish in the array
            }
    
        
        }

        activateFish(delta) {
            // Increment the accumulated time by the delta (time since last frame)
            this.accumulatedTime += delta;
            if (this.accumulatedTime >= CHECK_BAIT_INTERVAL) {
              this.checkBait();
              this.accumulatedTime = 0; // Resetting the accumulated time
            }
            
            // Always update the fish (swimming behavior)
            this.fishes.forEach(fish => fish.updateFish());
          }
        
          checkBait() {
            // Check if it's time to check for bait
            if (currentBait && this.scene.isLineCast && !this.scene.isFishOn) {
              let baitLocation = currentBait.getLocation();
              if (baitLocation) {
                this.fishes.forEach(fish => fish.checkBait(baitLocation));
              } else {
                console.error('Bait location is null!'); // Logging error if bait location is null
              }
            }
          }
        
 
        
          fishHooked(hookedFish) {
            currentBait = null;
            // Iterate over all fish
            this.fishes.forEach(fish => {
              // If the fish is in the 'baited' state and not the hooked fish, tell it to swim away
              if (fish.state === 'baited' && fish !== hookedFish) {
                fish.biteOn(); // Call the biteOn method on each fish
              }
            });
          }
    resetFish() {
      for (let fish of this.fishes) {
        fish.state = 'swimming';
      }
    }
}


