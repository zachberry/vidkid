- MIDIDevice isn't ready until a promise is resolved. Hope to have some way to prevent the setting of values/attributes until that promise is resolved. Maybe:

- Component.init().then(() => {

})

- gifs: https://github.com/CaptainCodeman/gif-player/blob/master/src/gif-player.js

- get rid of all that cable node that deals with mouse pointers if i don't end up using it

- allow you to change a connection

BUGS:

create a tween

refresh

this line causes bugs:
console.log('tweeeeeen', this.tween, TWEEN)
window.requestAnimationFrame(this.boundOnUpdate);

add in web animations api
https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API

audio device doesn't stop listening when you change device to ''

For nodes who can pop off their components into the screen:

onDestroy they need to return home
onReady they need to put them back

PROBLEMS:

- create vid device node, refresh, now move the node - it freezes

- this.easingFunction is not a function on tween (when you edit )
- cssbackground fails if screen changes

- example of flow problems:
  make a cond node and hook it up
  on restart the values flow incorrectly
  sends bad value to another node

- midi wasnt sending out bpm for some rasin
- trans value dialog under cables
