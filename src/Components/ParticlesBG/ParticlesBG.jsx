import React from 'react'
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticlesBG() {

	const particlesInit = async (main) => {
    // console.log(main);

    await loadFull(main);
  };

  const particlesLoaded = (container) => {
    // console.log(container);
  };


	return (
	<Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={
        {
  "background": {
    "color": {
      "value": "#343a40"
    },
    "position": "50% 50%",
    "repeat": "no-repeat",
    "size": "cover"
  },
  "fullScreen": {
    "zIndex": -1
  },
  "interactivity": {
    "events": {
      "onClick": {
        "enable": "none",
        "mode": "on"
      },
      "onDiv": {
        "selectors": "#repulse-div",
        "enable": false,
        "mode": "repulse"
      },
      "onHover": {
        "enable": true,
        "mode": "bubble",
        "parallax": {
          "enable": true,
          "force": 2,
          "smooth": 160
        }
      },
      "resize": false
    },
    "modes": {
      "bubble": {
        "distance": 200,
        "duration": 5,
        "opacity": 0.8,
        "size": 10,
        "divs": {
          "distance": 200,
          "duration": 0.4,
          "mix": false,
          "selectors": []
        }
      },
      "grab": {
        "distance": 20
      },
      "repulse": {
        "divs": {
          "distance": 200,
          "duration": 0.4,
          "factor": 5,
          "speed": 1,
          "maxSpeed": 2,
          "easing": "ease-out-quad",
          "selectors": []
        }
      }
    }
  },
  "motion": {
    "reduce": {
      "value": false
    }
  },
  "particles": {
    "color": {
      "value": "#ffffff"
    },
    "links": {
      "color": {
        "value": "#ffffff"
      },
      "distance": 150,
      "enable": true,
      "opacity": 0.4
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
      default: "bounce",
      },
      random: true,
      speed: 3,
      straight: true,
  },
    "number": {
      "density": {
        "enable": true
      },
      "value": 80
    },
    "opacity": {
      "random": {
        "enable": true
      },
      "value": {
        "min": 0.1,
        "max": 0.5
      },
      "animation": {
        "enable": true,
        "speed": 10,
        "minimumValue": 0.1
      }
    },
    "size": {
      "random": {
        "enable": true
      },
      "value": {
        "min": 0.1,
        "max": 5
      },
      "animation": {
        "enable": true,
        "speed": 10,
        "minimumValue": 0.1
      }
    }
  }
}
        } 
  />

	)
}