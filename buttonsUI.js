//Casting Slider Logic
function createSlider() {
    let sliderWidth = 200;
    this.sliderBackground = this.add.rectangle(sliderX, sliderY, sliderWidth, 10, 0x000000);
    let slideAmount = 0;
  
    // Position the knob at the right end of the slider
    this.sliderKnob = this.add.sprite(sliderX + (sliderWidth / 2), sliderY, 'castBtnSprite');
    this.sliderKnob.setInteractive();
    this.input.setDraggable(this.sliderKnob);
  
    // Add the drag event to capture the movement of the slider
    this.sliderKnob.on('drag', (pointer, dragX, dragY) => {
      //First make sure casting is allowed
      if(this.isCastable == true){
        // Make sure to constrain the dragX to the bounds of the slider
        this.sliderKnob.x = Phaser.Math.Clamp(dragX, sliderX - (sliderWidth / 2), sliderX + (sliderWidth / 2));
  
        slideAmount = this.sliderKnob.x - (sliderX + (sliderWidth / 2));
        slideAmount = Math.abs(this.sliderKnob.x - (sliderX + (sliderWidth / 2)));
        
        let angle = Phaser.Math.Linear(0, -90, slideAmount / 200);
        rod.setAngle(angle);
  
      }
    });
  
    // Add the dragend event to reset the knob to the right end of the slider
    this.sliderKnob.on('dragend', () => {
      if(this.isCastable == true){
        this.sliderKnob.x = sliderX + (sliderWidth / 2); // Reset the knob to the right end
        
        //call a cast line method and pass in the slideAmount
        castLine(this, slideAmount);
        //set isCastable to false
        this.isCastable = false;
        this.isLineCast = true;
        this.reelBtn.setVisible(true);
        this.sliderBackground.setVisible(false);
        this.sliderKnob.setVisible(false);
        
        slideAmount = 0;
        rod.setAngle(0);
        this.reelBtn.setPosition(this.sliderKnob.x, this.sliderKnob.y);
  
      
      }
    });
  }
  
  function createButton(scene, x, y, width, height, text) {
    const buttonShape = scene.add.graphics({ fillStyle: { color: 0x00AA00 } });
    buttonShape.fillRect(x, y, width, height);
    buttonShape.setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);
  
    const buttonText = scene.add.text(x + width / 4, y + height / 4, text, { color: '#ffffff' });
    return buttonShape;
  }
  function createReelBtn(scene){
    let reelBtnShape = scene.add.sprite(sliderX, sliderY, 'ReelBtnSprite');
    reelBtnShape.setInteractive();
    reelBtnShape.setVisible(false);
  
    reelBtnShape.on('pointerdown', () => scene.isReeling = true);
    reelBtnShape.on('pointerup', () => scene.isReeling = false);

    return reelBtnShape;
  }

  function testFishCaughtScreen(fishmanager, scene){
    let testicleFish = fishmanager.createOneFish();
    showFishCaughtScreen(scene, testicleFish);

  }
  const musicToggle = () => {
    if (isMusicPlaying) {
      backgroundMusic.stop(); // Turn off music
      console.log("turned off music");
    } else {
      backgroundMusic.play(); // Play music
      console.log("Music turned On");
    }
    isMusicPlaying = !isMusicPlaying; // Toggle the state
  };
  
  function createMusicBtnFunction(scene){
    const musicButton = scene.add.sprite(gameContainer.offsetWidth - 35, 60, 'musicBtnSpriteSheet');

    musicButton.setScale(0.5);
  
    // Initialize with the correct frame depending on whether music is playing
    musicButton.setFrame(isMusicPlaying ? 2 : 0);
    
    musicButton.setInteractive();
  
    // Pointer Hover In
    musicButton.on('pointerover', () => {
      const hoverFrame = isMusicPlaying ? 3 : 1;
      musicButton.setFrame(hoverFrame);
    });
  
    // Pointer Hover Out
    musicButton.on('pointerout', () => {
      const baseFrame = isMusicPlaying ? 2 : 0;
      musicButton.setFrame(baseFrame);
    });
  
    // Pointer Down
    musicButton.on('pointerdown', () => {
      musicToggle(); // Your existing function to toggle music
      const baseFrame = isMusicPlaying ? 2 : 0; // isMusicPlaying will be toggled in musicToggle
      musicButton.setFrame(baseFrame);
    });
  
    return musicButton;
  }
  