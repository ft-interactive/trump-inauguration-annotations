import axios from 'axios';
import MarkdownIt from 'markdown-it';

class Annotation {
	constructor(rootElement, options) {
    this.rootElement = rootElement;
		this.options = this.defaultOptions(options);
		this.highlightAttribute = 'data-highlight';
		this.highlightElements;
		this.annotations;
		this.selectedAnnotation;

    this.getAnnotations();
		this.appendAnnotation();
	}

  static init(rootElement, options = {}) {
    if (!rootElement) {
      rootElement = document.querySelectorAll('[data-annotation-text]');
    } else if (!(rootElement instanceof HTMLElement)) {
      rootElement = document.querySelectorAll(rootElement);
    }

    if (rootElement instanceof HTMLElement) {
      new Annotation(rootElement, options);
    } else {
      [].forEach.call(rootElement, (element) => {
        new Annotation(element, options)
      });
    }
  }

  defaultOptions(options) {
    return {
      annotationsId: options.annotationsId || this.rootElement.getAttribute('data-annotation-id'),
      minWidth: options.minWidth || null,
      maxWidth: options.maxWidth || null,
      gutter: options.gutter || null
    }
  }

  bindListeners() {
		const eventHandler = (event) => {
				if (event.type === 'click' || (event.type === 'click' && event.keyCode === 13)) {
          this.openAnnotation(event.target);
          if (this.selectedHighlight) {
            this.selectedHighlight.setAttribute('aria-expanded', 'false');
          }
          this.selectedHighlight = event.target;
          this.selectedHighlight.setAttribute('aria-expanded', 'true');
        }
    };

    [].forEach.call(this.highlightElements, (element) => {
      element.addEventListener('click', eventHandler);
      element.addEventListener('keyup', (event) => {
        if (event.keyCode === 13) {
				  this.openAnnotation(event.target);
          if (this.selectedHighlight) {
            this.selectedHighlight.setAttribute('aria-expanded', 'false');
          }
          this.selectedHighlight = event.target;
          this.selectedHighlight.setAttribute('aria-expanded', 'true');
        }
      });
		});

    let inView = [];
    window.addEventListener('scroll', (e) => {
      [].forEach.call(this.highlightElements, (element) => {
        if (element.getBoundingClientRect().top < (document.documentElement.clientHeight / 2)) {
          if (element.getBoundingClientRect().top > 0) {
            inView.push(element);
          } else {
            inView.splice(inView.indexOf(element), 1);
          }

          if(inView.length) {
            this.openAnnotation(inView[inView.length - 1]);
          }
        }
      });

     // console.log('scroll')
    });
	}

	getAnnotations() {
		axios.get(`http://bertha.ig.ft.com/view/publish/gss/${this.options.annotationsId}/authors,annotations`)
  		.then(data => {
				this.annotations = data.data.annotations;
				this.addHighlighting();
				this.bindListeners();
  		}).catch(error => {
    		console.error(error);
  		});
	}

  addHighlighting() {
  	this.annotations.forEach((annotation, index) => {
			if(this.elementContainingAnnotationMatcher(annotation.match)) {
				this.highlightMarkup(this.elementContainingAnnotationMatcher(annotation.match), annotation.match, index);
			}
  	});
		this.highlightElements = this.rootElement.querySelectorAll(`[${this.highlightAttribute}]`);
	}

  highlightMarkup(node, matcher, annotationIndex) {
		const highlight = document.createElement('mark');
    highlight.innerHTML = matcher;
		highlight.tabIndex = 1;
    highlight.classList.add('speech--highlight');
    highlight.setAttribute(this.highlightAttribute, annotationIndex);
    highlight.setAttribute('aria-expanded', 'false');
    highlight.setAttribute('aria-controls', 'annotation');

    node.innerHTML = node.innerHTML.replace(matcher, highlight.outerHTML);
	}

  elementContainingAnnotationMatcher(matcher) {
		for (var i = 0; i < this.rootElement.childNodes.length; i++) {
			if (this.rootElement.childNodes[i].textContent.includes(matcher)) {
    		return this.rootElement.childNodes[i];
				break;
  		}
		};
	}

  appendAnnotation() {
    const annotationWidth = this.calculateAnnotationWidth();
		this.annotationModal = document.createElement('aside');
		this.annotationModal.id = 'annotation';
    this.annotationModal.setAttribute('aria-hidden', true);
    this.annotationModal.setAttribute('aria-live', 'polite');
		this.annotationModal.classList.add('speech--annotation');

    if (annotationWidth) {
      this.annotationModal.setAttribute('style', `width: ${annotationWidth}px; position: absolute; margin: 0`);
    }

    this.rootElement.appendChild(this.annotationModal);
	}

  openAnnotation(clickedElement) {
    const annotationIndex = clickedElement.getAttribute(this.highlightAttribute);
    this.annotationModal.innerHTML = this.generateAnnotationMarkup(this.annotations[annotationIndex]);

    this.annotationModal.style.top = `${this.calculateAnnotationYPosition(clickedElement, this.annotationModal).top}px`;


    this.annotationModal.style.left = `${this.calculateAnnotationYPosition(clickedElement, this.annotationModal).left}px`;

    this.annotationModal.style.visibility = 'visible';

    this.annotationModal.setAttribute('aria-hidden', false);

    clickedElement.parentNode.insertBefore(this.annotationModal, clickedElement.nextSibling)
  }

  generateAnnotationMarkup(data) {
    const md = new MarkdownIt();
    return `<h3><span class="o-typography-subhead--standard">${data.author}</span></h3> ${md.render(data.annotation.md)}`;
  }

  calculateAnnotationWidth() {
    const spaceForAnnotation = (document.documentElement.clientWidth - (this.options.gutter + this.options.gutter / 2)) - (this.rootElement.getBoundingClientRect().left + this.rootElement.clientWidth);


    let width = spaceForAnnotation > this.options.minWidth ? spaceForAnnotation : 0;

    width = this.options.maxWidth && width > this.options.maxWidth ? this.options.maxWidth : width;

    return width;

  }
  calculateAnnotationYPosition(highlight, annotation) {


    const topOfHighlight = highlight.offsetTop;
    const heightOfAnnotation = annotation.clientHeight;
    const bottomOfSpeech = this.rootElement.clientHeight + this.rootElement.offsetTop;
    const leftPosition = this.rootElement.clientWidth + this.options.gutter;



    return {
      top: topOfHighlight + heightOfAnnotation < bottomOfSpeech ? topOfHighlight : topOfHighlight - ((topOfHighlight + heightOfAnnotation) - bottomOfSpeech),
      left: leftPosition
    };
  }
}

export default Annotation;