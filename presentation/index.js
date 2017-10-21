import React from 'react';
import { Deck, Heading, Slide, Text, MarkdownSlides, Link } from 'spectacle';
import CodeSlide from 'spectacle-code-slide';

// Import theme
import createTheme from 'spectacle/lib/themes/default';

// Require CSS
require('normalize.css');
require('spectacle/lib/themes/default/index.css');

const theme = createTheme(
  {
    primary: 'rgb(240, 240, 240)',
    secondary: 'black',
    tertiary: 'rgb(0, 142, 0)',
    // used for progress
    quartenary: 'rgb(0, 142, 0)',
  },
  {
    primary: 'inherit',
    secondary: 'inherit',
  },
);

export default class Presentation extends React.Component {
  render() {
    return (
      <Deck
        controls={false}
        contentHeight={1000}
        contentWidth={1500}
        progress={'bar'}
        transition={['fade']}
        transitionDuration={100}
        theme={theme}
      >
        <Slide bgColor="primary">
          <Heading size={1} fit lineHeight={1} textColor="secondary">
            Device Responsive Apps
          </Heading>
          <Heading size={4} margin="100px 0 0" textColor="tertiary" fit>
            Rafael Pedicini /{' '}
            <Link target="new" href="https://github.com/rafrex">
              @rafrex
            </Link>{' '}
            on GitHub /{' '}
            <Link href="mailto:rafael@rafrex.com">rafael@rafrex.com</Link>
          </Heading>
        </Slide>
        {MarkdownSlides`
Make web apps that feel native on every device
---
#### Size
Tailor UX to device/window size
---
#### Can
Tailor UX to device type

Can the user... hover, swipe, long press, etc
---
#### Is
Element level interactions

Is the user... hovering with a mouse, touching with a finger, etc
---
**Size** and **Can** we need to know at render time
          `}
        <CodeSlide
          lang="js"
          code={require('raw-loader!./mediaQuery.jse')}
          ranges={[
            { loc: [0, 6], note: 'Size can be determined with a media query' },
            {
              loc: [2, 5],
              note:
                'Side note - love the render prop pattern, I think react-media was the first place I saw it used',
            },
          ]}
        />
        {MarkdownSlides`
What about **Can**?

If only...

\`window.navigator.deviceType\`

`}
        <CodeSlide
          lang="js"
          code={require('raw-loader!./detectItState.jse')}
          ranges={[
            {
              loc: [0, 1],
              note:
                'Use the up and down arrow keys to navigate within code slides',
            },
            {
              loc: [1, 2],
              title: 'Detect It State Object',
              note: 'deviceType is always 1 of 3 strings',
            },
            { loc: [3, 5], note: 'hasMouse and hadTouch are booleans' },
            { loc: [5, 6], note: 'primaryInput is always 1 of 2 strings' },
            {
              loc: [2, 3],
              note:
                'Whether the browser supports passive event listeners - useful when setting event listeners, which is another thing I use detect-it for',
            },
            { loc: [1, 6], title: 'Detect It State Object' },
          ]}
        />
        {MarkdownSlides`
Demo [Detect It](http://detect-it.rafrex.com/)
---
**Device Examples**
- Large \`mouseOnly\` (macbook - normal window)
- Small \`mouseOnly\` (macbook - small window)
- Small \`touchOnly\` (iphone)
- Large \`touchOnly\` (ipad)
- Large \`hybrid primaryInput mouse\` (surface)
- Small \`hybrid primaryInput mouse\` (surface)
- Small \`hybrid primaryInput touch\` (galaxy note)
---
**How I use Detect It**
---
Create two responsive versions of the app based on \`primaryInput\` (slightly different component trees rendered out of the same React app)
---
Each version scales responsively based on the screen/window size with the UX optimized for the \`primaryInput\` (hover for mouse, gestures for touch, etc)
---
Note that when the \`deviceType\` is \`hybrid\`, while the UX is still optimized for \`touch\` or \`mouse\` the other input type is supported and can still control the app
  `}
        <CodeSlide
          lang="js"
          code={require('raw-loader!./detectItExample1.jse')}
          ranges={[
            {
              loc: [0, 1],
              title: 'Detect It Example',
              note: 'Import detectIt',
            },
            {
              loc: [2, 4],
              note: 'Use primaryInput in a ternary to decide what to render',
            },
            { loc: [4, 7], note: 'Render the Touch or Mouse UX component' },
            { loc: [0, 9] },
          ]}
        />
        <CodeSlide
          lang="js"
          code={require('raw-loader!./detectItExample2.jse')}
          ranges={[
            {
              loc: [0, 9],
              note: 'Set page margin based on primaryInput',
            },
          ]}
        />
        {MarkdownSlides`
Now for the interactive part... **Is** the user...
---
For styling user interactions this usually falls under interactive CSS pseudo-classes

\`:hover\`

\`:active\`

\`:focus\`
---
But what about reacting to interactive state chages?

...no hooks for \`:hover\` and \`:active\` states
---
And what about styling touch interactions?

...maybe
---
Let's dig into the interative CSS state machine

\`normal\`

\`hover\`

\`hoverActive\`

\`active\`
---
First let's define some abstract mouse, touch, and keyboard states
- **\`mouseOn\`**: the mouse is on the element
- **\`buttonDown\`**: the mouse button is down while the mouse is on the element
- **\`touchDown\`**: at least one touch point is in contact with the screen and started on the element
- **\`focusKeyDown\`**: element has focus and its trigger key is down
---
#### \`normal\`
- \`!mouseOn && !buttonDown && !touchDown && !focusKeyDown\`
- \`.class:not(:hover):not(:active)\`
- Not commonly used in CSS (zeroing out/overriding base styles is used instead)
---
#### \`hover\`
- Only \`hover\` styles applied
- \`(mouseOn && !buttonDown && !focusKeyDown) || (after touchDown and sticks until you tap someplace else)\`
- The sticky hover CSS bug on touch devices
---
#### \`hoverActive\`
- Both \`hover\` and \`active\` styles applied
- \`(mouseOn && buttonDown) || (mouseOn && focusKeyDown) || (touchDown, but not consistent across browsers)\`
- \`.class:hover, .class:active\`
---
#### \`active\`
- Only \`active\` styles applied
- \`(buttonDown && !mouseOn currently, but had mouseOn when buttonDown started) || (focusKeyDown && !mouseOn) || (touchDown but not on the element currently, but not consistent across browsers)\`
---
#### wahhhh?
---
Learn the edge cases or make something better
---
React Interactive state machine

\`normal\`

\`hover\`

\`hoverActive\`

\`touchActive\`

\`keyActive\`
        `}
        <CodeSlide
          lang="js"
          code={require('raw-loader!./reactInteractiveStateMachine.jse')}
          ranges={[
            { loc: [0, 5], note: 'RI normal state' },
            { loc: [6, 11], note: 'RI hover state' },
            { loc: [12, 17], note: 'RI hoverActive state' },
            { loc: [18, 21], note: 'RI keyActive state' },
            { loc: [22, 24], note: 'RI touchActive state' },
          ]}
        />
        {MarkdownSlides`
And what about \`:focus\`?
---
It turns out that \`:focus\` is just as bad...
`}

        <Slide>
          <Text>
            Tab the page to see focus styles. Then click on each item.
            Unfortunately when custom focus styles are set they are always
            applied no matter how focus was entered.
          </Text>
          <button className="focus-test">I'm a button</button>
          <button className="focus-test style-focus-state">
            I'm a button with :focus styles
          </button>
          <a href="#/33" className="focus-test">
            I'm a link
          </a>
          <a href="#/33" className="focus-test style-focus-state">
            I'm a link with :focus styles
          </a>
        </Slide>
        {MarkdownSlides`
React Interactive focus states

\`focusFromTab\`

\`focusFromMouse\`

\`focusFromTouch\`
      `}
        <CodeSlide
          lang="js"
          code={require('raw-loader!./reactInteractiveStateObject.jse')}
          ranges={[
            {
              loc: [1, 2],
              note: 'iState is always 1 of 5 strings',
              title: 'RI State Object',
            },
            {
              loc: [2, 3],
              note: 'focus is always 1 or 4 values',
              title: 'RI State Object',
            },
            {
              loc: [0, 4],
              title: 'RI State Object',
              note: 'This is the actual interal state object used by RI',
            },
          ]}
        />
        <CodeSlide
          lang="js"
          code={require('raw-loader!./reactInteractiveApi.jse')}
          ranges={[
            {
              loc: [0, 1],
              title: 'React Interactive API',
              note: 'import Interactive',
            },
            {
              loc: [2, 4],
              note:
                'What the Interactive component is rendered as, can be anything - div, span, a, etc',
            },
            {
              loc: [4, 5],
              note:
                "Or it can be a React component such as React Router's Link",
            },
            { loc: [6, 7], note: 'hover state style object' },
            {
              loc: [7, 11],
              note: 'Or hover state options object for use with css classes',
            },
            {
              loc: [14, 17],
              note:
                'All states take a style object, an options object, or a string indicating a state to match',
            },
            {
              loc: [16, 17],
              note:
                "If it's a string, then that state's style/options object will be used for this state too",
            },
            {
              loc: [12, 13],
              note: 'Convenience wrapper around 3 active states',
            },
            {
              loc: [20, 23],
              note:
                'Style the focus state based on how it was entered, or omit to not style that state',
            },
            {
              loc: [18, 19],
              note: 'Convenience wrapper around 3 focus states',
            },
            {
              loc: [24, 25],
              note:
                'Hook called on every state change, receives prevState and nextState objects',
            },
            {
              loc: [35, 38],
              note:
                "onStateChange handler recevies RI's prev and next internal state objects",
            },
            {
              loc: [25, 26],
              note: 'Called on mouse click, touch tap, and key click',
            },
            {
              loc: [39, 42],
              note:
                'clickType is a string, 1 of mouseClick, tapClick, or keyClick',
            },
            { loc: [26, 27], note: 'Long press hook for touch input' },
            {
              loc: [28, 30],
              note:
                "Takes standard style and className props too, these are merged with the current state's style and class name",
            },
          ]}
        />
        <CodeSlide
          lang="js"
          code={require('raw-loader!./reactInteractiveLinkExample.jse')}
          ranges={[
            {
              loc: [0, 3],
              title: 'InteractiveLink Example',
              note: 'Imports...',
            },
            { loc: [4, 6], note: 'InteractiveLink wraps Interactive' },
            { loc: [6, 11], note: 'as prop depends on to and href props' },
            {
              loc: [11, 12],
              note:
                'Only stay in the touchActive state while a tap is possible',
            },
            { loc: [12, 13], note: 'Pass through props' },
            { loc: [14, 15], note: 'Pass through children' },
            { loc: [18, 23], note: 'Use defaultProps for interactive styles' },
            { loc: [19, 20], note: 'hover state style object' },
            {
              loc: [20, 21],
              note:
                'String indicating to match the hover state style for all active states',
            },
            {
              loc: [21, 22],
              note:
                'focusFromTab state style - note that by omitting focusFromMouse and focusFromTouch no styles will be applied when in those states',
            },
            {
              loc: [27, 28],
              note: 'Using InteractiveLink as a React Router Link',
            },
            { loc: [28, 29], note: 'Using InteractiveLink as an a tag link' },
          ]}
        />
        {MarkdownSlides`
Demo [React Interactive](http://react-interactive.rafrex.com/)
---
Demo [Photography Website](http://rafael.photo/)
---
Hiring?
        `}
        <Slide bgColor="primary">
          <Text textColor="tertiary" fit>
            <Link target="new" href="https://github.com/rafrex/detect-it">
              Detect It
            </Link>{' '}
            /{' '}
            <Link
              target="new"
              href="https://github.com/rafrex/react-interactive"
            >
              React Interactive
            </Link>{' '}
            / <Link href="mailto:rafael@rafrex.com">rafael@rafrex.com</Link>
          </Text>
        </Slide>
      </Deck>
    );
  }
}
