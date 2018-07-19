- MIDIDevice isn't ready until a promise is resolved. Hope to have some way to prevent the setting of values/attributes until that promise is resolved. Maybe:

- Component.init().then(() => {

})

- sucks that you have to do this for select:
  {
  ...
  type: N.set(),
  control: N.select() //<-- dont want to have to specify this!
  }
