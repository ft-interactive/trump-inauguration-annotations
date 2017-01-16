import article from './article';
import getFlags from './flags';
import getOnwardJourney from './onward-journey';
import axios from 'axios';

export default async function() {
  const d = await article();
  const flags = await getFlags();
  const onwardJourney = await getOnwardJourney();
  try {
    d.annotations = (await axios(`http://bertha.ig.ft.com/view/publish/gss/17v6FLbDsDwxC7XGsqesLJiwq6CEd4FH3T8Erqawo9R4/authors,annotations`)).data.annotations;
    console.dir(d.annotations)
  } catch (e) {
    console.error(e);
  }

  return {
    ...d,
    flags,
    onwardJourney,
  };
}
