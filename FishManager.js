class FishManager {
    constructor(scene, water) {
        this.scene = scene; // Storing the Phaser scene to access it later
        this.water = water; // Storing the water boundaries to access it later
        this.fishes = []; // An array to hold the fish sprites
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
    
        // Other methods related to fish, such as updating their positions, can be added here

    activateFish(){

        this.fishes.forEach(fish =>fish.updateFish());
    }
 }


