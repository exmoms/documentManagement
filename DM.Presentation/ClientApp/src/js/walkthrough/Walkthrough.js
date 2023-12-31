import MoveTo from "moveto";
// import SweetScroll from "sweet-scroll";

export default class Walkthrough {
  constructor(walkthrough, options) {
    this.walkthrough = walkthrough;
    this.options = options;
  }

  onCreate(func) {
    this.handleCreate = func;
  }

  onRemove(func) {
    this.handleRemove = func;
  }

  onComplete(func) {
    this.handleComplete = func;
  }

  skip() {
    this.handleComplete(false);
  }

  scrollTo(el) {
    const tolerance = this.options.scrollOffset
      ? this.options.scrollOffset + 20
      : 20;

    const moveTo = new MoveTo({
      tolerance,
      duration: 500,
    });
    moveTo.move(el);

    // const sweetScroll = new SweetScroll({
    //   duration: 500,
    //   offset: this.options.scrollOffset ? -this.options.scrollOffset - 20 : -20
    // });
    // sweetScroll.toElement(el);
  }

  generateHighlightId() {
    return Math.random().toString(36).substr(2, 9);
  }
}
