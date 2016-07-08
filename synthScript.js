$(document).ready(function(){

  // Get a context
  var ctx;
  function init() {
    try {
      // Fix up for prefixing
      window.AudioContext = window.AudioContext||window.webkitAudioContext;
      ctx = new AudioContext();
    }
    catch(e) {
      alert('Web Audio API is not supported in this browser');
    }
  }

  init();

  var masterGain = ctx.createGain();
  masterGain.gain.value = 0.0;

  // Set up the bass and treble osc
  var bass = ctx.createOscillator();
  bass.type = "square";
  var treb = ctx.createOscillator();
  var oscGain = ctx.createGain();
  oscGain.gain.value = 0.0;

  // Set their frequency based on key presses
  var lastChar;
  document.onkeydown = function (e) { 
    e = e || window.event; 
    var charCode = e.charCode || e.keyCode; 
    lastChar = charCode;
    oscGain.gain.value = 1.0;
    switch (lastChar) {
      case 90:
        bass.frequency.value = 261;
        treb.frequency.value = 392;
        break;  

      case 83:
        bass.frequency.value = 277;
        treb.frequency.value = 415;
        break;

      case 88:
        bass.frequency.value = 293;
        treb.frequency.value = 440;
        break;   

      case 68:
        bass.frequency.value = 311;
        treb.frequency.value = 466;
        break;
        
      case 67:
        bass.frequency.value = 329;
        treb.frequency.value = 493;
        break;  

      case 86:
        bass.frequency.value = 349;
        treb.frequency.value = 523;
        break;

      case 71:
        bass.frequency.value = 369;
        treb.frequency.value = 554;
        break;   

      case 66:
        bass.frequency.value = 392;
        treb.frequency.value = 587;
        break; 
        
      case 72:
        bass.frequency.value = 415;
        treb.frequency.value = 622;
        break;  

      case 78:
        bass.frequency.value = 440;
        treb.frequency.value = 659;
        break;

      case 74:
        bass.frequency.value = 466;
        treb.frequency.value = 698;
        break;   

      case 77:
        bass.frequency.value = 493;
        treb.frequency.value = 740;
        break; 
       
      case 81:
        bass.frequency.value = 523;
        treb.frequency.value = 784;
        break;  

      case 50:
        bass.frequency.value = 554;
        treb.frequency.value = 830;
        break;

      case 87:
        bass.frequency.value = 587;
        treb.frequency.value = 880;
        break;   

      case 51:
        bass.frequency.value = 622;
        treb.frequency.value = 932;
        break;
        
      case 69:
        bass.frequency.value = 659;
        treb.frequency.value = 987;
        break;  

      case 82:
        bass.frequency.value = 698;
        treb.frequency.value = 1046;
        break;

      case 53:
        bass.frequency.value = 740;
        treb.frequency.value = 1108;
        break;   

      case 84:
        bass.frequency.value = 784;
        treb.frequency.value = 1174;
        break; 
        
      case 54:
        bass.frequency.value = 830;
        treb.frequency.value = 1244;
        break;  

      case 89:
        bass.frequency.value = 880;
        treb.frequency.value = 1318;
        break;

      case 55:
        bass.frequency.value = 932;
        treb.frequency.value = 1396;
        break;   

      case 85:
        bass.frequency.value = 987;
        treb.frequency.value = 1480;
        break;

      case 73:
        bass.frequency.value = 1046;
        treb.frequency.value = 1567;
        break;

      default:
        oscGain.gain.value = 0.0;
        break; 
    }
    
  };
  document.onkeyup = function (f) {
    f = f || window.event;
    var relCode = f.charCode || f.keyCode;
    if (relCode == lastChar){
    oscGain.gain.value = 0.0;
    }
  };

  // Chorus stuff
  var corRate = ctx.createOscillator();
  var corDepth = ctx.createGain();
  var del1 = ctx.createDelay(1);
  var del1Gain = ctx.createGain();
  var corGain = ctx.createGain();

  corRate.connect(corDepth);
  corDepth.connect(del1.delayTime);
  del1.connect(del1Gain);
  del1Gain.connect(del1);
  del1.connect(corGain);

  corRate.frequency.value = 0.5; // Chorus rate
  corDepth.gain.value = 0.001; //Chorus depth
  del1.delayTime.value = 0.03; // Initial delay time
  del1Gain.gain.value = 0.5; // Feedback value
  corGain.gain.value = 0.9; // Output level
  

  // Delay
  var del2 = ctx.createDelay(1);
  var del2Gain = ctx.createGain();
  var del2Out = ctx.createGain();

  del2.connect(del2Gain);
  del2Gain.connect(del2);
  del2.connect(del2Out);

  del2.delayTime.value = 0.5; // Delay time
  del2Gain.gain.value = 0.7; // Feedback value
  del2Out.gain.value = 0.3; // Output level


  // Set up the vibrato
  var vibDepth = ctx.createGain();
  var freqOsc = ctx.createOscillator();
  
  freqOsc.connect(vibDepth);
  vibDepth.connect(bass.frequency);
  freqOsc.connect(bass.frequency);

  vibDepth.gain.value = 3; // Depth
  freqOsc.frequency.value = 0.6; // Rate


  // Low-pass
  var lpf = ctx.createBiquadFilter();
  
  bass.connect(lpf);
  treb.connect(lpf);

  lpf.frequency.value = 5000; // Freq


  // Set up tremolo
  var trem = ctx.createOscillator();
  var tremGain = ctx.createGain();

  trem.connect(tremGain);
  tremGain.connect(lpf.frequency);

  trem.frequency.value = 0.5; //Rate
  tremGain.gain.value = 1000; //Depth


  // Start all of the oscillators
  freqOsc.start(0);
  bass.start(0);
  treb.start(0);
  trem.start(0);
  corRate.start(0);
  lpf.connect(oscGain);
  oscGain.connect(del1);
  oscGain.connect(del2);

  oscGain.connect(masterGain);
  del1Gain.connect(masterGain);
  del2Out.connect(masterGain);

  masterGain.connect(ctx.destination);

  //Master volume
  var masterVolume = 0;
  $('#masterVolumeSlider').slider({
    orientation: "vertical",
    value: 0,
    slide: function(event, ui) {
      masterVolume = (ui.value * 0.01);
      masterGain.gain.value = masterVolume;
    }
  });

  //Chorus controls
  var chorusRate = 0.5;
  var chorusDepth = 0.001;
  var chorusDelay = 0.03;
  var chorusFeedback = 0.5;
  var chorusOutput = 0.9;

  $('#chorusRateSlider').slider({
    orientation: "vertical",
    value: 50,
    slide: function(event, ui) {
      chorusRate = (ui.value * 0.025);
      corRate.frequency.value = chorusRate;
    }
  });
  $('#chorusDepthSlider').slider({
    orientation: "vertical",
    value: 1,
    slide: function(event, ui) {
      chorusDepth = (ui.value * 0.001);
      corDepth.gain.value = chorusDepth;
    }
  });
  $('#chorusDelaySlider').slider({
    orientation: "vertical",
    value: 3,
    slide: function(event, ui) {
      chorusDelay = (ui.value * 0.01);
      del1.delayTime.value = chorusDelay;
    }
  });
  $('#chorusFeedbackSlider').slider({
    orientation: "vertical",
    value: 50,
    slide: function(event, ui) {
      chorusFeedback = (ui.value * 0.01);
      del1Gain.gain.value = chorusFeedback;
    }
  });
  $('#chorusOutputSlider').slider({
    orientation: "vertical",
    value: 90,
    slide: function(event, ui) {
      chorusOutput = (ui.value * 0.01);
      corGain.gain.value = chorusOutput;
    }
  });


  //Delay controls
  var delayTime = 0.5;
  var delayFeedback = 0.7;
  var delayOuput = 0.3;

  $('#delayTimeSlider').slider({
    orientation: "vertical",
    value: 50,
    slide: function(event, ui) {
      delayTime = (ui.value * 0.01);
      del2.delayTime.value = delayTime;
    }
  });
  $('#delayFeedbackSlider').slider({
    orientation: "vertical",
    value: 70,
    slide: function(event, ui) {
      delayFeedback = (ui.value * 0.01);
      del2Gain.gain.value = delayFeedback;
    }
  });
  $('#delayOutputSlider').slider({
    orientation: "vertical",
    value: 30,
    slide: function(event, ui) {
      delayOuput = (ui.value * 0.01);
      del2Out.gain.value = delayOuput;
    }
  });


    //Vibrato controls
  var vibratoDepth = 3;
  var vibratoRate = 0.6;
  $('#vibratoRateSlider').slider({
    orientation: "vertical",
    value: 30,
    slide: function(event, ui) {
      vibratoDepth = (ui.value * 0.1);
      vibDepth.gain.value = vibratoDepth;
    }
  });
  $('#vibratoDepthSlider').slider({
    orientation: "vertical",
    value: 5,
    slide: function(event, ui) {
      vibratoRate = (ui.value * 0.03);
      freqOsc.frequency.value = vibratoRate;
    }
  });


  //Filter control
  var lpFreq = 5000;
  $('#lpFreqSlider').slider({
    orientation: "vertical",
    value: 50,
    slide: function(event, ui) {
      lpFreq = (ui.value * 100);
      lpf.frequency.value = lpFreq;
    }
  });

  //Tremolo controls
  var tremoloRate
  var tremoloDepth
  $('#tremoloRateSlider').slider({
    orientation: "vertical",
    value: 10,
    slide: function(event, ui) {
      tremoloRate = (ui.value * 0.05);
      trem.frequency.value = tremoloRate;
    }
  });
  $('#tremoloDepthSlider').slider({
    orientation: "vertical",
    value: 50,
    slide: function(event, ui) {
      tremoloDepth = (ui.value * 20);
      tremGain.gain.value = tremoloDepth;
    }
  });
});