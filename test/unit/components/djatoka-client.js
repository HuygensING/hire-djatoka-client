import DjatokaClient from "../../../src/components/djatoka-client";
import Api from "../../../src/api/api";
import store from "../../../src/api/store";
import expect from "expect";
import sinon from "sinon";
import React from "react/addons";
import sd from "skin-deep";
const TestUtils = React.addons.TestUtils;
const shallowRenderer = TestUtils.createRenderer();

const config = {
	"identifier": "http://localhost:8080/jp2/13434696301791.jp2",
	"imagefile": "/var/cache/tomcat6/temp/cache15069217286472590195734192754.jp2",
	"width": "4355",
	"height": "3300",
	"dwtLevels": "6",
	"levels": "6",
	"compositingLayerCount": "1"
};
const service = "https://tomcat.tiler01.huygens.knaw.nl/adore-djatoka/resolver";

const MOUSE_UP = 0;
// const MOUSE_DOWN = 1;
// const TOUCH_END = 0;
// const TOUCH_START = 1;
// const TOUCH_PINCH = 2;

// const RESIZE_DELAY = 5;


describe("DjatokaClient", function() {

	before(function() {
		global.window = {};
	});

	it("should declare a lot of properties with the constructor", function() {
		sinon.stub(DjatokaClient.prototype, "onResize", function() { return "onResize"; });
		sinon.stub(DjatokaClient.prototype, "onAnimationFrame", function() { return "onAnimationFrame"; });
		sinon.stub(DjatokaClient.prototype, "onMouseMove", function() { return "onMouseMove"; });
		sinon.stub(DjatokaClient.prototype, "onMouseUp", function() { return "onMouseUp"; });

		const tree = sd.shallowRender(<DjatokaClient config={config} service={service} />);
		const viewer = tree.getMountedInstance();

		expect(viewer.api).toBeAn(Api);
		expect(viewer.api.config).toEqual(config);
		expect(viewer.api.service).toEqual(service);
		expect(viewer.state).toEqual({width: null, height: null});
		expect(viewer.movement).toEqual({x: 0, y: 0});
		expect(viewer.touchPos).toEqual({x: 0, y: 0});
		expect(viewer.mousePos).toEqual({x: 0, y: 0});
		expect(viewer.imagePos).toEqual({x: 0, y: 0});
		expect(viewer.mouseState).toEqual(MOUSE_UP);
		expect(viewer.imageCtx).toEqual(null);
		expect(viewer.resizeDelay).toEqual(0);
		expect(viewer.scale).toEqual(1.0);
		expect(viewer.level).toEqual(null);
		expect(viewer.width).toEqual(null);
		expect(viewer.height).toEqual(null);
		expect(viewer.focalPoint).toEqual(null);
		expect(viewer.abortAnimationFrame).toEqual(false);
		expect(viewer.frameBuffer).toEqual([]);
		expect(viewer.touchmap).toEqual({startPos: false, positions: [], tapStart: 0, lastTap: 0, pinchDelta: 0, pinchDistance: 0});
		expect(viewer.requestAnimationFrame).toBeA(Function);
		expect(viewer.cancelAnimationFrame).toBeA(Function);

		expect(viewer.resizeListener()).toEqual("onResize");
		expect(viewer.animationFrameListener()).toEqual("onAnimationFrame");
		expect(viewer.mousemoveListener()).toEqual("onMouseMove");
		expect(viewer.mouseupListener()).toEqual("onMouseUp");

		DjatokaClient.prototype.onResize.restore();
		DjatokaClient.prototype.onAnimationFrame.restore();
		DjatokaClient.prototype.onMouseMove.restore();
		DjatokaClient.prototype.onMouseUp.restore();

	});

	it("should have the correct listeners in its props", function() {
		sinon.stub(DjatokaClient.prototype, "onMouseDown", function() { return "onMouseDown"; });
		sinon.stub(DjatokaClient.prototype, "onTouchEnd", function() { return "onTouchEnd"; });
		sinon.stub(DjatokaClient.prototype, "onTouchMove", function() { return "onTouchMove"; });
		sinon.stub(DjatokaClient.prototype, "onTouchStart", function() { return "onTouchStart"; });
		sinon.stub(DjatokaClient.prototype, "onWheel", function() { return "onWheel"; });

		shallowRenderer.render(<DjatokaClient config={config} service={service} />);
		const viewer = shallowRenderer.getRenderOutput();
		const interactionProps = viewer.props.children[1].props;
		expect(interactionProps.onMouseDown()).toEqual("onMouseDown");
		expect(interactionProps.onTouchEnd()).toEqual("onTouchEnd");
		expect(interactionProps.onTouchMove()).toEqual("onTouchMove");
		expect(interactionProps.onTouchStart()).toEqual("onTouchStart");
		expect(interactionProps.onWheel()).toEqual("onWheel");

		DjatokaClient.prototype.onMouseDown.restore();
		DjatokaClient.prototype.onTouchEnd.restore();
		DjatokaClient.prototype.onTouchMove.restore();
		DjatokaClient.prototype.onTouchStart.restore();
		DjatokaClient.prototype.onWheel.restore();
	});

	it("should call commitResize, store a reference to the canvas context, subscribe to the store and add event listeners to the window with componentDidMount", function() {
		const tree = sd.shallowRender(<DjatokaClient config={config} service={service} />);
		const viewer = tree.getMountedInstance();
		let registeredListeners = [];
		viewer.animationFrameListener = "animationFrameListener";
		viewer.resizeListener = "resizeListener";
		viewer.mousemoveListener = "mousemoveListener";
		viewer.mouseupListener = "mouseupListener";

		global.window.addEventListener = function(name, func) {
			registeredListeners.push([name, func]);
		};

		sinon.stub(viewer, "commitResize");
		sinon.stub(React, "findDOMNode", function(arg) {
			expect(arg).toEqual(viewer);
			return {
				children: [{getContext: function(str) { expect(str).toEqual("2d"); return "-canvas-context-"; }}]
			};
		});

		sinon.stub(viewer, "requestAnimationFrame", function(listener) {
			expect(listener).toEqual("animationFrameListener");
		});

		sinon.stub(viewer, "receiveNewState");

		sinon.stub(viewer, "setState", function(stateObj, cb) {
			expect(stateObj).toEqual({realViewPort: { x: 0, y: 0, w: 0, h: 0, zoom: 0, reposition: false }, mousewheel: null, fillMode: null, freeMovement: false });
			cb();
		});

		sinon.stub(store, "subscribe", function(cb) {
			cb();
		});

		viewer.componentDidMount();

		expect(registeredListeners[0]).toEqual(["resize", "resizeListener"]);
		expect(registeredListeners[1]).toEqual(["mousemove", "mousemoveListener"]);
		expect(registeredListeners[2]).toEqual(["mouseup", "mouseupListener"]);
		sinon.assert.calledOnce(viewer.commitResize);
		sinon.assert.calledOnce(React.findDOMNode);
		sinon.assert.calledOnce(viewer.requestAnimationFrame);
		sinon.assert.calledOnce(viewer.setState);
		sinon.assert.calledOnce(store.subscribe);
		sinon.assert.calledOnce(viewer.receiveNewState);
		viewer.commitResize.restore();
		viewer.requestAnimationFrame.restore();
		viewer.setState.restore();
		viewer.receiveNewState.restore();
		React.findDOMNode.restore();
		store.subscribe.restore();

		delete global.window.addEventListener;
	});

	it("should remove event listeners unsubscribe from store, and abort the animation frame listener with componentWillUnmount", function() {
		const tree = sd.shallowRender(<DjatokaClient config={config} service={service} />);
		const viewer = tree.getMountedInstance();
		let removedListeners = [];
		let unsubscribed = false;
		let canceledAnimationFrame = false;

		viewer.animationFrameListener = "animationFrameListener";
		viewer.resizeListener = "resizeListener";
		viewer.mousemoveListener = "mousemoveListener";
		viewer.mouseupListener = "mouseupListener";
		viewer.unsubscribe = function() { unsubscribed = true; };
		viewer.cancelAnimationFrame = function() { canceledAnimationFrame = true; };

		global.window.removeEventListener = function(name, func) {
			removedListeners.push([name, func]);
		};

		expect(viewer.abortAnimationFrame).toEqual(false);
		viewer.componentWillUnmount();
		expect(viewer.abortAnimationFrame).toEqual(true);
		expect(removedListeners[0]).toEqual(["resize", "resizeListener"]);
		expect(removedListeners[1]).toEqual(["mousemove", "mousemoveListener"]);
		expect(removedListeners[2]).toEqual(["mouseup", "mouseupListener"]);
		expect(unsubscribed).toEqual(true);
		expect(canceledAnimationFrame).toEqual(true);

		delete global.window.removeEventListener;
	});


	it("should reinitialize the Api and canvas when componentWillReceiveProps is called with a different config.identifier", function() {
		const tree = sd.shallowRender(<DjatokaClient config={config} service={service} />);
		const viewer = tree.getMountedInstance();
		const newConfig = {...config, identifier: ":newid:"};
		sinon.stub(viewer, "commitResize");

		expect(viewer.api.config.identifier).toEqual(config.identifier);
		viewer.componentWillReceiveProps({config: newConfig, service: service});

		sinon.assert.calledOnce(viewer.commitResize);
		expect(viewer.api.config.identifier).toEqual(":newid:");

		viewer.commitResize.restore();
	});

	it("should not reinitialize the Api and canvas when componentWillReceiveProps is called with the same config.identifier", function() {
		const tree = sd.shallowRender(<DjatokaClient config={config} service={service} />);
		const viewer = tree.getMountedInstance();
		const newConfig = {...config};
		sinon.stub(viewer, "commitResize");
		viewer.componentWillReceiveProps({config: newConfig, service: service});
		sinon.assert.notCalled(viewer.commitResize);
		viewer.commitResize.restore();
	});


	it("should only update the DOM with shouldComponentUpdate when viewport dimensions change, or id prop changes", function() {
		const tree = sd.shallowRender(<DjatokaClient config={config} service={service} />);
		const viewer = tree.getMountedInstance();
		const newConfig = {...config, identifier: ":newid:"};
		expect(viewer.shouldComponentUpdate({config: config}, {width: null, height: null})).toEqual(false);
		expect(viewer.shouldComponentUpdate({config: config}, {width: 1, height: null})).toEqual(true);
		expect(viewer.shouldComponentUpdate({config: config}, {width: null, height: 1})).toEqual(true);
		expect(viewer.shouldComponentUpdate({config: newConfig}, {width: null, height: null})).toEqual(true);

	});


	it("should dispatch viewport state to the store with notifyRealImagePos; apply* flags should always be false to prevent infinite callback loops", function() {
		const tree = sd.shallowRender(<DjatokaClient config={config} service={service} />);
		const viewer = tree.getMountedInstance();
		viewer.state.width = 50;
		viewer.state.height = 50;

		sinon.stub(viewer.api, "getRealScale", function() { return ":scale:"; });
		sinon.stub(viewer.api, "getRealImagePos", function() { return { x: 10, y: 10, w: 100, h: 100 }; });
		sinon.stub(store, "dispatch", function(dispatchData) {
			expect(dispatchData).toEqual({
				type: "SET_REAL_VIEWPORT",
				realViewPort: { x: -0.1, y: -0.1, w: 0.5, h: 0.5, zoom: ":scale:", reposition: false, applyZoom: false }
			});
		});
		viewer.notifyRealImagePos();
		sinon.assert.calledOnce(viewer.api.getRealScale);
		sinon.assert.calledOnce(viewer.api.getRealImagePos);
		sinon.assert.calledOnce(store.dispatch);
		viewer.api.getRealScale.restore();
		viewer.api.getRealImagePos.restore();
		store.dispatch.restore();
	});

	it("should reposition the viewport in receiveNewState, state.realViewPort.reposition", function() {
		const tree = sd.shallowRender(<DjatokaClient config={config} service={service} />);
		const viewer = tree.getMountedInstance();
		viewer.state = store.getState();
		viewer.state.realViewPort.reposition = true;
		viewer.state.realViewPort.x = .1;
		viewer.state.realViewPort.y = .2;
		viewer.level = 5;
		viewer.scale = 1;
		sinon.stub(viewer.api, "getRealImagePos", function(pos, s, lvl) {
			expect(pos).toEqual({x: 0, y: 0});
			expect(s).toEqual(1);
			expect(lvl).toEqual(5);
			return { x: 10, y: 10, w: 100, h: 100 };
		});
		sinon.stub(viewer, "loadImage", function(obj) { expect(obj).toEqual({level: 5, scale: 1}); });
		sinon.stub(viewer, "correctBounds");

		viewer.receiveNewState();

		sinon.assert.calledOnce(viewer.api.getRealImagePos);
		sinon.assert.calledOnce(viewer.loadImage);
		sinon.assert.calledOnce(viewer.correctBounds);
		expect(viewer.api.getRealImagePos.calledBefore(viewer.correctBounds)).toEqual(true);
		expect(viewer.correctBounds.calledBefore(viewer.loadImage)).toEqual(true);
		viewer.api.getRealImagePos.restore();
		viewer.loadImage.restore();
		viewer.correctBounds.restore();
		expect(viewer.imagePos).toEqual({x: -10, y: -20});
	});

	it("should apply zoom with receiveNewState when state.realViewPort.applyZoom", function() {
		const tree = sd.shallowRender(<DjatokaClient config={config} service={service} />);
		const viewer = tree.getMountedInstance();
		viewer.state = store.getState();
		viewer.focalPoint = "not null";
		viewer.state.realViewPort.applyZoom = true;
		viewer.state.realViewPort.zoom = ":zoom:";
		sinon.stub(viewer, "zoom");
		sinon.stub(viewer.api, "zoomTo", function(zoom, cb) {
			expect(zoom).toEqual(":zoom:");
			cb();
		});

		viewer.receiveNewState();

		sinon.assert.calledOnce(viewer.api.zoomTo);
		sinon.assert.calledOnce(viewer.zoom);
		expect(viewer.api.zoomTo.calledBefore(viewer.zoom)).toEqual(true);
		expect(viewer.focalPoint).toEqual(null);
		viewer.api.zoomTo.restore();
		viewer.zoom.restore();
	});

	it("should trigger zoomBy and dispatch sendMouseWheel(false) with receiveNewState when state.mousewheel");

/*
		if(this.state.mousewheel) {
			this.focalPoint = null;
			store.dispatch(sendMouseWheel(false));
			this.api.zoomBy(this.determineZoomFactor(this.state.mousewheel.deltaY), this.scale, this.level, this.zoom.bind(this));
		}
*/


	it("should set the fillMode and dispatch setFill(false) with receiveNewState when state.fillMode");
/*
		if(this.state.fillMode) {
			store.dispatch(setFill(false));
			this.imagePos.x = 0;
			this.imagePos.y = 0;
			this.loadImage({scaleMode: this.state.fillMode});
		}
*/


	it("should onAnimationFrame()");
	it("should onResize()");
	it("should commitResize()");
	it("should loadImage(opts = {scaleMode: this.props.scaleMode})");
	it("should setScale(s, l)");
	it("should setDimensions(w, h)");
	it("should center(w, h)");
	it("should correctBounds()");
	it("should onDimensions(s, l, w, h)");
	it("should zoom(s, l, w, h)");
	it("should determineZoomFactor(delta)");
	it("should onWheel(ev)");
	it("should render()");
});
