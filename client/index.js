/*
  TODO: delete this comment

  This file is where you bootstrap your JS code
  For example import stuff here:

  import {select} from 'd3-selection';
  import myComponent from './components/my-component';

  Split logical parts of you project into components e.g.

  /client
    - /components
        - /component-name
            - styles.scss
            - index.js
            - template.html

*/
import axios from 'axios';

class Annotation {
	constructor() {
		this.speechContainer = document.querySelector('[data-speech-body]');
		this.highlightAttribute = 'data-highlight';
		this.highlightElements;
		this.annotations;
		this.selectedAnnotation;
		this.getAnnotations();
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

	elementContainingAnnotationMatcher(matcher) {
		for (var i = 0; i < this.speechContainer.childNodes.length; i++) {
			if (this.speechContainer.childNodes[i].textContent.includes(matcher)) {
    		return this.speechContainer.childNodes[i];
				break;
  		}
		};
	}

	addHighlightMarkup(node, matcher, annotationIndex) {
		node.innerHTML = node.innerHTML.replace(matcher, `<mark class="annotation-highlight" ${this.highlightAttribute}="${annotationIndex}">${matcher}</mark>`)
	}

	addHighlighting() {
  	this.annotations.forEach((annotation, index) => {
			if(this.elementContainingAnnotationMatcher(annotation.match)) {
				this.addHighlightMarkup(this.elementContainingAnnotationMatcher(annotation.match), annotation.match, index);
			}
  	});
		this.highlightElements = this.speechContainer.querySelectorAll(`[${this.highlightAttribute}]`);
	}

	bindListeners() {
		[].forEach.call(this.highlightElements, (element) => {
			element.addEventListener('click', (event) => {
				this.removeAnnotation();
				this.appendAnnotation(event.target);
			});
		});
	}

	appendAnnotation(clickedElement) {
		const annotationIndex = clickedElement.getAttribute(this.highlightAttribute)
		const annotationModal = document.createElement('aside');
		annotationModal.setAttribute('data-annotation-modal', annotationIndex);
		annotationModal.classList.add('annotation-modal');
		annotationModal.innerHTML = this.annotations[annotationIndex].annotation.md;

		clickedElement.parentNode.insertBefore(annotationModal, clickedElement.nextSibling)
		this.selectedAnnotation = annotationModal;
	}

	removeAnnotation() {
		if (this.selectedAnnotation) {
			this.selectedAnnotation.parentNode.removeChild(this.selectedAnnotation);
		}
	}
}

new Annotation();
