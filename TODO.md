- MIDIDevice isn't ready until a promise is resolved. Hope to have some way to prevent the setting of values/attributes until that promise is resolved. Maybe:

- Component.init().then(() => {

})

- sucks that you have to do this for select:
  {
  ...
  type: N.set(),
  control: N.select() //<-- dont want to have to specify this!
  }

* When you edit the screen that detaches any dom elements (like from three.js!)

* handle bad input names

* gifs

* get rid of all that cable node that deals with mouse pointers if i don't end up using it

PROBLEMS:

- Unable to catch custom element exceptions
