class FishManager {
    constructor(scene) {
        this.scene = scene; // Storing the Phaser scene to access it later
        this.fishes = []; // An array to hold the fish sprites
    }

    createFish() {

        


        let fish = this.scene.add.sprite(100, 100, 'fish', 0);
        this.fishes.push(fish); // Store the fish in the array
        return fish; // Return the fish if needed
    }

    // Other methods related to fish, such as updating their positions, can be added here
}