import article from './article';
import getFlags from './flags';
import getOnwardJourney from './onward-journey';
import axios from 'axios';

function annotateSpeech(annotations) {
  let manipulatedHtml = speechBody.html;
  annotations.forEach((annotation) => {
    manipulatedHtml = manipulatedHtml.replace(annotation.match, `<mark class="annotation-highlight">${annotation.match}</mark>`)
  });

  return manipulatedHtml;
}

export default async function() {
  const d = await article();
  const flags = await getFlags();
  const onwardJourney = await getOnwardJourney();

  return {
    ...d,
    flags,
    onwardJourney,
  };
}
