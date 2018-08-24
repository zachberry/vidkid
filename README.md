# About

**Vid Kid** is a patchable visualization tool inspired by video modular synthesis but built for the web. Its purpose is to create live generative/controllable visuals for live music performance in the browser. Since it uses WebMIDI & Web Components it was designed in particular to work in Chrome. Other browsers might work with a subset of features but use at your own risk! (Psst... If you'd like to see it work in other browsers please let the Edge and FF teams know! Vote for  [Edge here](https://wpdev.uservoice.com/forums/257854-microsoft-edge-developer/suggestions/6508429-web-midi-api) and let Mozilla know you're interested [here](https://github.com/mozilla/standards-positions/issues/58)!

**Totally tubular disclaimer:** I consider this **alpha software** for the moment. You'll probably find bugs, it needs documentation and it needs tests. If you use this in a performance it could very well crash and eat your work! This is a consequence of a tight deadline to have it finished for JSConf US 2018 (This is my only defense). With that disclaimer out of the way I'd love for you to check it out and PRs are welcome.

# Try it out

[https://vidkid.app](https://vidkid.app)

# Installation

1.  Clone this project
1.  Run `yarn`

# Running

1.  Run `yarn start`

# Production build

1.  Run `yarn build`

# Give me a super fast example

1.  Go to [https://vidkid.app](https://vidkid.app)
2.  Right click on the grid background
3.  Select a new "Lazer Grid" [sic]
4.  Click on the plus near the 'selector' input
5.  Type in 'body' - The grid will jump to the display
6.  Hit the 'Fullscreen' button in the bottom of the display box
7.  Enjoy!

Psst... For more examples, check out the examples directory. Click 'Import' in the toolbar and paste some JSON in. Some of the examples rely on MIDI hardware. Examples are still being updated, woo!

# How it works

## When you start you'll see the Edit screen.

- Right click on the background to add a new node. I recommend starting with a new _Example Node_.
- Nodes can be patched together by clicking on the name of an output and then clicking on the name of an input. The idea here is that each node can send a value from its output to all node inputs connected to it.
- Nodes can be edited by clicking on the edit button (✎). Each node is a JS web component class that defines that nodes inputs, outputs and behavior. The _Example Node_ contains lots of comments that hopefully try to make sense of the different options.
- Nodes can be duplicated by clicking on the clone button (⎌).
- You can manually set the value of an input by clicking on the plus (+) button to expand that input. The control displayed is determined from the associated input definition in the node class.
- By connecting and creating nodes you can create flexible visualizations - at least, that's the goal!
- To create the actual visuals you need to interact with the **Screen** - That's the box in the upper-right. More on that in a second...

## Creating your own nodes

- Create a new **New Node** or **Example Node**, then click the edit button (✎). Now you can customize and create your own node.
- In order to have a node permanently available add a new file to "/library" and then import your node in "/library/all.js". If you create a cool useful node consider contributing it back to the project!

## The screen

- The screen is a simple webpage sandboxed in an iframe. You can edit the contents of the page by clicking 'Edit Page' in the upper right toolbar.
- Nodes can access the screen with `this.screen`. So for example, you could edit the screen and write `<div id="hello">Hello</div>`, then, create a node that changes the position of the node based on its inputs. For example, in your node:

```javascript
//...
onAttrChanged(name, oldValue, newValue) {
	if(name === "my-input") {
		this.screen.getElementById('hello').style.transform = "translate(" + newValue + ")";
	}
}
//...
```

- Next, you could create a new **Mouse** node which is a hardware node that reads the mouse. Then, connect the `x` output to the input of your newly created node. Now moving the mouse will move your `#hello` element!
- Click on the **Fullscreen** button inside the Screen preview to leave Edit view. Hit ESC to return back to Edit view.

## Secret tips for pro hackers:

- When inserting a node hold down Shift, then click on a node to add. The menu will stay open - this way you can add more than one node at a time.
- Click on the diamond icon on an input to be able to transform the incoming value. If, for example, you have a node that emits 0-1 into a node that expects a value from 0-360 you could create a transform function like `x * 360`. `x` is the only variable available and is the incoming value. You can also write any valid JS code here, for example, `Math.random()` to simply get a random value whenever this input receives a value.
- Use the Import and Export features to save your creations. These are exported as simple JSON text, how delightfully quaint.
- The Screen "fullscreen" button actually just makes the Screen fill up the browser window. For maximum enjoyment also fullscreen your browser and hide the toolbars. Then you can feel cool knowing that nobody will realize you're using a plain jane web browser! The UI doesn't do this by default because switching between actual fullscreen and back is annoying (at least, it is on a Mac).

# Contributing & Project Goals

The major roadmap from 0.alpha to 1.0 (and beyond?) is as follows:

- Needs a database (CouchDB) to store and retrieve documents.
- Need a way to create multiple visualizations and be able to transition between them. Essentially what exists now as the Edit View would become a "Scene" node. Then you could transition and activate/deactivate different scenes.
- Performance is pretty poor and needs optimization. There's not much to be done with too many `requestAnimationFrame` functions running however the React UI surely could be optimized.
- Speaking of, the React UI code is pretty sloppy (again, deadline 🙏), needs some clean up and refactoring. The code that draws the connecting cables in particular is pretty gross. Don't look at it.
- The _Insert New Node Menu_ thing needs organization.
- Need documentation on the inputs/outputs of each node.
- Tests!
- More base level nodes!
- Easter eggs?

All of these will be created as issues, but I wanted to give you the general idea of the major goals for the project.

# Final bit at the end of the README.md file

_"If every porkchop were perfect we wouldn't have hot dogs."_
