
/** 
 * DMF 1.0 
 * -------------------------------
 * (c) aeholic 
 * https://aeholic.github.io/dmf
 */

const [el, date, title, desc, url, copy, reset, copied, converted, image, fill, yt, ytId] = [
	_ => document.querySelector(_), _ => el('#date'), _ => el('#title'), 
  _ => el('#desc'), _ => el('#url'), _ => el('#copy'), _ => el('#reset'), 
  _ => el('#copied'), _ => el('#converted'), _ => el('#image'),
  'Fill the fields and hit \'Copy\'!', /youtu\.?be/, /watch\?v=|\.be\/|[\?|&].+/
]

const fetchYT = async (url) => {
	const [apiKey, videoId] = [
  	'AIzaSyCMQ9o13fj45WpJgDTpXHhVNyeyv6qowUc', url.match(yt) ? url.split(ytId)[1] : url
  ]
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`)
    if (response) return response.data.items[0].snippet.title
  } catch (error) {
    console.error(error.message)
  }
}

const inputs = document.querySelectorAll('#url, #date, #title, #desc')

inputs.forEach((elem) => { 
	elem.addEventListener('input', async (event) => {
  if (elem.id == 'url') date().value = moment().utcOffset(540).format('YYMMDD')	
  	if (url().value.trim().match(yt)) {
    	try {
        const id = event.target.value.trim().split(ytId)[1]
        title().value = await fetchYT(id) || ''
        image().src = 'https://i.ytimg.com/vi/'+id+'/0.jpg'
      } catch (error) {}
   	}
    if ([url(), date(), title()].every(k => k.value != '')) {
    	copy().disabled = false
      converted().textContent = await `\`${date().value.trim()}\` **${title().value.trim()}**${
      	desc().value.trim().length ? '\n*'+desc().value.trim()+'*\n' : '\n'}${
        !url().value.match(/http/) ? 'https://'+url().value.trim() : url().value.trim()}`
    } else {
    	converted().textContent = fill
      copy().disabled = true
    }
	})
})

copy().addEventListener('click', _ => {
  navigator.clipboard.writeText(converted().textContent)
  copied().textContent = 'Copied!'
})

reset().addEventListener('click', _ => {
  inputs.forEach(elem => elem.value = '')
  copied().textContent = ''
  image().src = ''
  converted().textContent = fill
  copy().disabled = true
})