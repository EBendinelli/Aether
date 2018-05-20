import { scale, randomRange } from 'Utils/Utils';
import * as PIXI from 'pixi.js';


export default class Particle {
  constructor(texture, application, options) {
    this.sprite = new PIXI.Sprite(texture);
    this.application = application;
    this.options = options;

    this.birthDate = undefined;
    this.recycle();

    // Initialization
    this.sprite.anchor.set(0, 1);
    this.application.stage.addChild(this.sprite);
    this.application.ticker.add(this.step.bind(this));
  }


  recycle() {
    // Reset Particle
    this.birthDate = Number(new Date());
    this.velocity = [ 2, -15 ];
    this.lifetime = randomRange(this.options.minDecay, this.options.maxDecay, 0);
    this.elapsed = 0;

    // Reset Sprite
    this.sprite.scale.set(this.options.startScale);
    this.sprite.alpha = 0.1;
    this.sprite.tint = this.options.startColor;
    this.sprite.x = this.options.parent[1].x + 2;
    this.sprite.y = this.options.parent[1].y;
    this.sprite.rotation = randomRange(-10, 10, 0) * Math.PI / 180;
  }


  step() {
    this.elapsed += this.application.ticker.elapsedMS;

    if (this.elapsed >= this.lifetime) {
      this.recycle();
    } else {
      const percentage = (this.elapsed / this.lifetime);

      let scaledSize = scale(this.options.startScale, this.options.endScale, percentage, false);
      this.sprite.scale.set(scaledSize);

      this.sprite.alpha = (1 - percentage) / 10;
      this.sprite.tint = this.options.gradientGenerator(percentage);
    }
  }
}
