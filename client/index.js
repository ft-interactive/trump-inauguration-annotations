import axios from 'axios';
import MarkdownIt from 'markdown-it';

class Annotation {
	constructor() {
		this.speechContainer = document.querySelector('[data-speech]');
		this.highlightAttribute = 'data-highlight';
		this.highlightElements;
		this.annotations;
		this.selectedAnnotation;

    this.getAnnotations();
		this.appendAnnotation();
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
	}

	getAnnotations() {
		axios.get(`http://bertha.ig.ft.com/view/publish/gss/17v6FLbDsDwxC7XGsqesLJiwq6CEd4FH3T8Erqawo9R4/authors,annotations`)
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
		this.highlightElements = this.speechContainer.querySelectorAll(`[${this.highlightAttribute}]`);
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
		for (var i = 0; i < this.speechContainer.childNodes.length; i++) {
			if (this.speechContainer.childNodes[i].textContent.includes(matcher)) {
    		return this.speechContainer.childNodes[i];
				break;
  		}
		};
	}

  appendAnnotation() {
		this.annotationModal = document.createElement('aside');
		this.annotationModal.id = 'annotation';
    this.annotationModal.setAttribute('aria-hidden', true);
    this.annotationModal.setAttribute('aria-live', 'polite');
		this.annotationModal.classList.add('speech--annotation');
    this.speechContainer.appendChild(this.annotationModal);
	}

  openAnnotation(clickedElement) {
    const annotationIndex = clickedElement.getAttribute(this.highlightAttribute);
    this.annotationModal.innerHTML = this.generateAnnotationMarkup(this.annotations[annotationIndex]);
    this.annotationModal.setAttribute('style', `top: ${this.calculateAnnotationPosition(clickedElement, this.annotationModal)}px; visibility: visible`)
    this.annotationModal.setAttribute('aria-hidden', false);

    clickedElement.parentNode.insertBefore(this.annotationModal, clickedElement.nextSibling)
  }

  generateAnnotationMarkup(data) {
    const md = new MarkdownIt();
    return `<h3><span class="o-typography-subhead--standard">${data.author}</span></h3> ${md.render(data.annotation.md)}`;
  }

  calculateAnnotationPosition(highlight, annotation) {
    const topOfHighlight = highlight.offsetTop;
    const heightOfAnnotation = annotation.clientHeight;
    const bottomOfSpeech = this.speechContainer.clientHeight + this.speechContainer.offsetTop;

    return topOfHighlight + heightOfAnnotation < bottomOfSpeech ? topOfHighlight : topOfHighlight - ((topOfHighlight + heightOfAnnotation) - bottomOfSpeech);
  }
}

new Annotation();
