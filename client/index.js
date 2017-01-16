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

function addHighlightMarkup(node, matcher, annotationIndex) {
	node.innerHTML = node.innerHTML.replace(matcher, `<mark class="annotation-highlight" data-annotation="${annotationIndex}">${matcher}</mark>`)
}

function elementContainingAnnotationMatcher(matcher) {
  let speechBody = document.querySelector('[data-speech-body]');
	for (var i = 0; i < speechBody.childNodes.length; i++) {
		if (speechBody.childNodes[i].textContent.includes(matcher)) {
    	return speechBody.childNodes[i];
			break;
  	}
	};
}

function highlightSpeech(annotations) {
  annotations.forEach((annotation, index) => {
		if(elementContainingAnnotationMatcher(annotation.match)) {
    	addHighlightMarkup(elementContainingAnnotationMatcher(annotation.match), annotation.match, index);
		}
  });
}

axios.get(`http://bertha.ig.ft.com/view/publish/gss/17v6FLbDsDwxC7XGsqesLJiwq6CEd4FH3T8Erqawo9R4/authors,annotations`)
  .then(data => {
    console.log(data.data.annotations);
		highlightSpeech(data.data.annotations);
  }).catch(error => {
    console.error(error);
  });
