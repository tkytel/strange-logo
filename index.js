/*
 * フォーム送信時のイベントハンドラ
 * mantela.json を取得し、接続情報を解析し、表示する。
 */
formMantela.addEventListener('submit', async e => {
	e.preventDefault();
	btnGenerate.disabled = true;
	const start = performance.now();
	outputStatus.textContent = '';
	const mantelas = await (_ => checkNest.checked
		? fetchMantelas(urlMantela.value, +numNest.value)
		: fetchMantelas(urlMantela.value))();
	const stop = performance.now();
	outputStatus.textContent = `Done. (${stop - start} ms)`;
	btnGenerate.disabled = false;

    body = "";

	mantelas.forEach((v, _) => {
        body += `
/Times-Roman findfont 20 scalefont setfont
/y y 23 sub def
x y moveto
(${v.aboutMe.name}) show
/Times-Roman findfont 11 scalefont setfont
(  ${v.aboutMe.identifier}) show
/x x 0 sub def
/y y 6 sub def
x y moveto
        `;
        
        v.extensions.forEach((ext, _) => {
            body += `
y MarginBottom lt {
    showpage
    /y PageHeight MarginTop sub def
    /x 50 def
} if

/Times-Roman findfont 12 scalefont setfont
/x x -5 sub def
/y y 14 sub def
x y moveto
(- ${ext.extension}, ${ext.name}, ${ext.type}) show
/x x 5 sub def
/y y 0 sub def
x y moveto
            `;
        })
	});
    
    generate();
});

/*
 * first のパラメータが指定されているときは自動入力して表示する
 */
const urlSearch = new URLSearchParams(document.location.search);
if (urlSearch.get('first')) {
	urlMantela.value = urlSearch.get('first');
	btnGenerate.click();
}

function downloadTextFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
  
    document.body.appendChild(a);
    a.click();
  
    // 後片付け
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function fetchTemplate(url) {
    const res = await fetch(url);
    return res.text();
}

async function generate() {
    const template = await fetchTemplate('./template.ps');

    let date = "/text (as of ";
    date += formatDateJST(new Date());
    date += ".) def"

    const replaced = template
        .replace('% body', body)
        .replace('% date', date);
    downloadTextFile('book.ps', replaced);
}

function formatDateJST(date = new Date()) {
    // JST（日本時間）に変換
    const options = {
      timeZone: 'Asia/Tokyo',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
  
    const localeDate = new Intl.DateTimeFormat('en-US', options).formatToParts(date);
  
    const parts = Object.fromEntries(localeDate.map(p => [p.type, p.value]));
  
    const dayWithSuffix = parts.day + getOrdinalSuffix(Number(parts.day));
  
    return `${parts.month} ${dayWithSuffix}, ${parts.year} ${parts.hour}:${parts.minute} JST`;
}

// 序数（st, nd, rd, th）を付ける
function getOrdinalSuffix(n) {
if (n >= 11 && n <= 13) return 'th';
    switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}