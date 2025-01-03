import { InitOptions } from './interfaces';
const xtermCSS = `
.xterm {
    cursor: text;
	padding: 10px;
    position: relative;
    user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
}

.xterm.focus,
.xterm:focus {
    outline: none;
}

.xterm .xterm-helpers {
    position: absolute;
    top: 0;
    /**
     * The z-index of the helpers must be higher than the canvases in order for
     * IMEs to appear on top.
     */
    z-index: 5;
}

.xterm .xterm-helper-textarea {
    padding: 0;
    border: 0;
    margin: 0;
    /* Move textarea out of the screen to the far left, so that the cursor is not visible */
    position: absolute;
    opacity: 0;
    left: -9999em;
    top: 0;
    width: 0;
    height: 0;
    z-index: -5;
    /** Prevent wrapping so the IME appears against the textarea at the correct position */
    white-space: nowrap;
    overflow: hidden;
    resize: none;
}

.xterm .composition-view {
    /* TODO: Composition position got messed up somewhere */
    background: transparent;
    color: #FFF;
    display: none;
    position: absolute;
    white-space: nowrap;
    z-index: 1;
}

.xterm .composition-view.active {
    display: block;
}

.xterm .xterm-viewport {
    /* On OS X this is required in order for the scroll bar to appear fully opaque */
    background-color: transparent;
    overflow-y: scroll;
    cursor: default;
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
}

.xterm .xterm-screen {
    position: relative;
}

.xterm .xterm-screen canvas {
    position: absolute;
    left: 0;
    top: 0;
}

.xterm .xterm-scroll-area {
    visibility: hidden;
}

.xterm-char-measure-element {
    display: inline-block;
    visibility: hidden;
    position: absolute;
    top: 0;
    left: -9999em;
    line-height: normal;
}

.xterm.enable-mouse-events {
    /* When mouse events are enabled (eg. tmux), revert to the standard pointer cursor */
    cursor: default;
}

.xterm.xterm-cursor-pointer,
.xterm .xterm-cursor-pointer {
    cursor: pointer;
}

.xterm.column-select.focus {
    /* Column selection mode */
    cursor: crosshair;
}

.xterm .xterm-accessibility,
.xterm .xterm-message {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 10;
    color: transparent;
}

.xterm .live-region {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
}

.xterm-dim {
    opacity: 0.5;
}

.xterm-underline {
    text-decoration: underline;
}

.xterm-strikethrough {
    text-decoration: line-through;
}

.xterm-screen .xterm-decoration-container .xterm-decoration {
	z-index: 6;
	position: absolute;
}

.xterm-decoration-overview-ruler {
    z-index: 7;
    position: absolute;
    top: 0;
    right: 0;
    pointer-events: none;
}

.xterm-decoration-top {
    z-index: 2;
    position: relative;
}
`;

const Stylesheet = `
	
	
	#termo-{{titleID}}-container{
		box-sizing: border-box;
		font-family: {{fontFamily}};
		position: fixed;
		bottom: 12px;
		right: 12px;
		border: 1px solid rgba(1, 22, 39, 0.8);
		width: 705px;
		max-width: 100vw;
		height: 482px;
		padding: 8px 4px 4px;
		gap: 8px;
		display: flex;
		flex-direction: column;
		z-index: 2147483647;
		transition: transform 0.3s ease, width 0.3s ease, height 0.3s ease;
		background: transparent;
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
	}
	.termo-container *{
		font-family: {{fontFamily}};
		box-sizing: border-box;
	}
		
	.termo-header{
		display: flex;
		justify-content: space-between;
		line-height: 1;
		cursor: grab;
		padding: 1px 4px;
		font-size: 14px;
		font-weight: 500;
		font-family: monospace;
		text-transform: uppercase;
		user-select: none;
		color: rgba(1, 22, 39, 0.8);
		background: transparent;
	}
	.termo-header .termo-close-button{
		cursor: pointer;
	}
	.termo-header .termo-resize-button{
		cursor: pointer;
	}
	
	[mode="docked"] .termo-header{
		cursor: pointer;
	}
	
	.darker .termo-header{
		color: rgba(254, 254, 254, 0.8);
	}
	
	.termo-container .termo-terminal{
		background-color: transparent;
		border: 1px solid rgba(1, 22, 39, 0.4);
		border-radius: 4px;
		padding: 0px;
		flex-grow: 1;
		overflow: auto;
	}
	
	.darker #termo-{{titleID}}-container {
		border-color: rgba(254, 254, 254, 0.8);
	}

	.darker .termo-header {
		color: rgba(254, 254, 254, 0.8);
	}

	.darker .termo-container .termo-terminal {
		border-color: rgba(254, 254, 254, 0.4);
	}

	.xterm .xterm-viewport {
		background-color: transparent !important;
	}
	
	${xtermCSS}


`;

export default function (opts: InitOptions) {
    let fontFamily = opts.fontFamily;
    let titleID = opts.id;
    let newStyle = Stylesheet.replace(/{{fontFamily}}/g, fontFamily);
    newStyle = newStyle.replace(/{{titleID}}/g, titleID);
    return newStyle;
}
