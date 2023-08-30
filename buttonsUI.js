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
        this.reelBtnShape.setVisible(true);
        this.sliderBackground.setVisible(false);
        this.sliderKnob.setVisible(false);
        
        slideAmount = 0;
        rod.setAngle(0);
        this.reelBtnShape.setPosition(this.sliderKnob.x, this.sliderKnob.y);
  
      
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

  function testButtonFunction(fishmanager, scene){
    let testicleFish = fishmanager.createOneFish();
    showFishCaughtScreen(scene, testicleFish);
  }
  