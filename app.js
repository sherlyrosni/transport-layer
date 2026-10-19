
const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const state={completed:new Set(JSON.parse(localStorage.getItem('tlCompleted')||'[]')),journey:0,service:'HTTPS',hs:0,case:0,quiz:0,score:0,answered:false};

function updateProgress(){const pct=Math.round(state.completed.size/8*100);$('#progressText').textContent=pct+'%';$('#progressFill').style.width=pct+'%'}
function showSection(id){
  $$('.lesson').forEach(s=>s.classList.toggle('active',s.id===id));
  $$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.section===id));
  state.completed.add(id);localStorage.setItem('tlCompleted',JSON.stringify([...state.completed]));updateProgress();
  window.scrollTo({top:0,behavior:'smooth'});$('#sidebar').classList.remove('open')
}
$$('.nav-btn').forEach(b=>b.onclick=()=>showSection(b.dataset.section));
$$('[data-go]').forEach(b=>b.onclick=()=>showSection(b.dataset.go));
$('#menuBtn').onclick=()=>$('#sidebar').classList.toggle('open');
$('#themeBtn').onclick=()=>{const d=document.documentElement.dataset.theme==='dark';document.documentElement.dataset.theme=d?'':'dark';localStorage.setItem('tlTheme',d?'light':'dark')};
if(localStorage.getItem('tlTheme')==='dark')document.documentElement.dataset.theme='dark';
$('#resetBtn').onclick=()=>{if(confirm('Reset progres belajar dan kuis?')){localStorage.clear();state.completed.clear();updateProgress();restartQuiz();showSection('home')}};
updateProgress();

const journey=[
 ['Laptop tersambung ke jaringan','Laptop sudah terhubung ke Wi‑Fi, tetapi “terhubung” belum berarti semua kebutuhan komunikasi selesai.','Pertanyaan berikutnya: apakah laptop sudah memiliki konfigurasi IP, gateway, dan DNS server?','START','20%','18%', ['nodeClient'],'Baru tersambung'],
 ['DHCP memberi konfigurasi jaringan','Laptop biasanya tidak perlu mengisi IP secara manual. DHCP membantu memberikan IP Address, subnet mask, default gateway, dan DNS server.','DHCP menjawab masalah “laptop ini akan memakai konfigurasi jaringan apa?”','DHCP','41%','48%', ['nodeClient','nodeNetwork'],'IP diperoleh'],
 ['Pengguna mengetik nama website','Pengguna mengetik opac.perpustakaan.ac.id. Nama ini mudah diingat manusia, tetapi komputer tetap membutuhkan IP server.','Masalahnya sekarang bukan lagi “IP laptop berapa?”, tetapi “IP milik nama domain ini berapa?”','NAME','49%','57%', ['nodeClient','nodeNetwork'],'Mencari server'],
 ['DNS menerjemahkan nama menjadi IP','Laptop meminta bantuan DNS. DNS mengembalikan IP yang terkait dengan nama domain tujuan.','DHCP memberi konfigurasi kepada klien. DNS menerjemahkan nama domain menjadi IP. Fungsinya berbeda.','DNS','79%','65%', ['nodeClient','nodeNetwork','nodeDns'],'IP server diketahui'],
 ['Transport Layer menentukan layanan','Setelah IP server diketahui, komunikasi juga harus diarahkan ke layanan yang tepat. Untuk HTTPS, destination port umumnya 443.','IP menjawab “host mana?”, port membantu menjawab “layanan/aplikasi mana?”',':443','73%','28%', ['nodeClient','nodeWeb'],'Tujuan layanan: 443'],
 ['TCP membangun koneksi','Untuk contoh HTTPS tradisional, client dan server membangun koneksi TCP melalui SYN → SYN-ACK → ACK.','Handshake bukan isi halaman web. Ia menyiapkan koneksi transport.', 'TCP','82%','27%', ['nodeClient','nodeWeb'],'TCP connected'],
 ['HTTPS request dikirim dan halaman tampil','Browser mengirim request HTTPS. Server memproses dan mengirim response, lalu browser menampilkan halaman OPAC.','Satu aktivitas sederhana ternyata melibatkan beberapa layanan dan layer yang bekerja berurutan.','HTTPS','84%','24%', ['nodeClient','nodeWeb'],'OPAC tampil ✓']
];
function renderJourney(){
  const j=journey[state.journey];$('#stepNo').textContent=`Langkah ${state.journey+1} dari ${journey.length}`;$('#stepTitle').textContent=j[0];$('#stepText').textContent=j[1];$('#stepWhy').textContent=j[2];
  $('#packet').textContent=j[3];$('#packet').style.left=j[4];$('#packet').style.bottom=j[5];$$('.node').forEach(n=>n.classList.remove('active-node'));j[6].forEach(id=>$('#'+id).classList.add('active-node'));$('#clientStatus').textContent=j[7];
  $('#prevStep').disabled=state.journey===0;$('#nextStep').textContent=state.journey===journey.length-1?'Ulangi simulasi ↻':'Berikutnya →'
}
$('#nextStep').onclick=()=>{state.journey=(state.journey+1)%journey.length;renderJourney()};$('#prevStep').onclick=()=>{if(state.journey>0)state.journey--;renderJourney()};renderJourney();

const ports={HTTPS:'443',HTTP:'80',DNS:'53',DHCP:'67/68'};
$$('#serviceTabs button').forEach(b=>b.onclick=()=>{state.service=b.dataset.service;$$('#serviceTabs button').forEach(x=>x.classList.toggle('active',x===b));$('#portFeedback').textContent='Pilih satu port.'});
$$('.port-options button').forEach(b=>b.onclick=()=>{const ok=b.dataset.port===ports[state.service];$('#portFeedback').textContent=ok?`Benar. ${state.service} menggunakan ${b.dataset.port} pada konteks dasar ini.`:`Belum tepat. Coba pikirkan lagi layanan ${state.service}.`;$('#portFeedback').style.color=ok?'#9be5bf':'#ffc6c6'});

function renderHs(){$$('.msg').forEach(x=>x.classList.remove('show'));if(state.hs>=1)$('#syn').classList.add('show');if(state.hs>=2)$('#synack').classList.add('show');if(state.hs>=3)$('#ack').classList.add('show');
 const b=$('#hsBtn'), badge=$('#hsBadge');b.disabled=false;
 if(state.hs===0){b.textContent='Mulai: kirim SYN';badge.textContent='Belum terhubung'}
 if(state.hs===1){b.textContent='Server balas SYN + ACK';badge.textContent='Negosiasi 1/3'}
 if(state.hs===2){b.textContent='Client kirim ACK';badge.textContent='Negosiasi 2/3'}
 if(state.hs===3){b.textContent='Koneksi terbentuk ✓';badge.textContent='TCP connection ready';b.disabled=true}
}
$('#hsBtn').onclick=()=>{if(state.hs<3)state.hs++;renderHs()};$('#hsReset').onclick=()=>{state.hs=0;renderHs()};renderHs();

const scenarios=[
 ['Membuka katalog web yang membutuhkan data lengkap dan berurutan','TCP','Pada pembelajaran dasar, HTTP/HTTPS tradisional dibahas menggunakan TCP karena reliabilitas penting.'],
 ['Voice call real-time: paket terlambat sering lebih baik dilewati daripada ditunggu terlalu lama','UDP','Banyak aplikasi real-time memakai UDP atau mekanisme serupa karena latensi lebih penting daripada retransmission oleh transport.'],
 ['Query DNS sederhana untuk mencari IP sebuah nama domain','UDP','DNS query biasa sering memakai UDP; DNS juga dapat menggunakan TCP pada kondisi tertentu.']
];
const psc=$('#protocolScenarios');
scenarios.forEach((s,i)=>{const d=document.createElement('div');d.className='scenario';d.innerHTML=`<div><b>${i+1}. ${s[0]}</b><p>Pilih protokol yang paling masuk akal.</p></div><div><button>TCP</button><button>UDP</button></div>`;$$('button',d).forEach(btn=>btn.onclick=()=>{$$('button',d).forEach(x=>x.classList.remove('correct','wrong'));btn.classList.add(btn.textContent===s[1]?'correct':'wrong');$('p',d).textContent=s[2]});psc.appendChild(d)});

const flows=[
 '<b>Join Wi‑Fi:</b> laptop sudah memiliki jalur komunikasi ke jaringan, tetapi belum tentu memiliki konfigurasi IP.',
 '<b>DHCP:</b> laptop memperoleh IP Address, subnet mask, default gateway, dan DNS server.',
 '<b>DNS:</b> nama domain yang diketik pengguna diterjemahkan menjadi IP server.',
 '<b>TCP:</b> client dan server membangun koneksi transport. Port membantu mengarahkan ke layanan yang benar.',
 '<b>HTTPS:</b> browser mengirim request web terlindungi TLS dan server mengirim response.'
];
function setFlow(i){$$('.flowbuttons button').forEach((b,j)=>b.classList.toggle('active',i===j));$('#flowExplain').innerHTML=flows[i]}
$$('.flowbuttons button').forEach((b,i)=>b.onclick=()=>setFlow(i));setFlow(0);

$$('[data-modal]').forEach(b=>b.onclick=()=>{$('#modalBg').classList.add('show');$('#'+b.dataset.modal).classList.add('show')});
function closeModal(){$('#modalBg').classList.remove('show');$$('.modal').forEach(m=>m.classList.remove('show'))}
$$('.close').forEach(b=>b.onclick=closeModal);$('#modalBg').onclick=e=>{if(e.target.id==='modalBg')closeModal()};

const layerData={
 application:['APPLICATION','Apa yang ingin dilakukan pengguna?','Browser ingin meminta halaman OPAC menggunakan HTTPS.',[['HTTPS','request web'],['Data','permintaan pengguna']]],
 transport:['TRANSPORT','Aplikasi mana dan bagaimana data dikirim?','Transport Layer menggunakan port untuk membantu mengidentifikasi layanan dan TCP/UDP sebagai mekanisme transport.',[['Source Port','ephemeral'],['Destination Port','443'],['Protocol','TCP']]],
 network:['NETWORK','Host tujuan berada di mana?','IP Address digunakan untuk logical addressing dan pengiriman antarjaringan.',[['Source IP','IP laptop'],['Destination IP','IP server']]],
 datalink:['DATA LINK','Untuk link saat ini, frame diserahkan ke siapa?','Data Link membentuk frame dan menggunakan MAC Address pada link lokal. Jika MAC belum diketahui pada IPv4 lokal, ARP dapat dibutuhkan.',[['Source MAC','interface lokal'],['Destination MAC','next hop'],['FCS','cek error']]],
 physical:['PHYSICAL','Bagaimana bit direpresentasikan pada media?','Physical Layer mengirim representasi bit melalui media fisik/nirkabel sebagai sinyal listrik, cahaya, atau radio.',[['Bit','0 / 1'],['Media','kabel / radio'],['Signal','representasi bit']]]
};
function renderLayer(k){const d=layerData[k];$('#layerLabel').textContent=d[0];$('#layerTitle').textContent=d[1];$('#layerText').textContent=d[2];$('#layerPieces').innerHTML=d[3].map(x=>`<div><b>${x[0]}</b>${x[1]}</div>`).join('');$$('.stack-buttons button').forEach(b=>b.classList.toggle('active',b.dataset.layer===k))}
$$('.stack-buttons button').forEach(b=>b.onclick=()=>renderLayer(b.dataset.layer));renderLayer('application');

const cases=[
 ['Laptop baru tersambung, tetapi tidak mendapat konfigurasi IP','Pengguna sudah terhubung ke Wi‑Fi, tetapi alamat jaringan yang diharapkan tidak diperoleh otomatis.',['Wi‑Fi connected','IP otomatis gagal'],'DHCP','DHCP bertugas memberikan konfigurasi IP secara otomatis kepada klien.'],
 ['Bisa mengakses server lewat IP, tetapi nama domain gagal','Ping ke IP server berhasil. Namun ketika nama domain digunakan, layanan tidak terbuka.',['IP reachable','Nama domain gagal'],'DNS','Karena koneksi ke IP berhasil, masalah paling logis ada pada resolusi nama ke IP, yaitu DNS.'],
 ['Nama domain sudah menjadi IP, tetapi layanan web tidak merespons','Resolusi DNS berhasil. Host dapat dijangkau, tetapi layanan web tertentu tidak menjawab.',['DNS OK','Host reachable','Service unavailable'],'PORT/SERVICE','Masalah lebih mengarah pada layanan/port yang tidak tersedia atau tidak merespons.'],
 ['Aplikasi real-time terganggu ketika harus menunggu paket terlambat','Pada komunikasi suara, menunggu terlalu lama justru menurunkan kualitas percakapan.',['Real-time','Latency sensitive'],'UDP','Banyak aplikasi real-time memakai UDP atau mekanisme serupa karena latensi lebih penting daripada retransmission oleh transport.'],
 ['Komputer tahu IPv4 host lokal tetapi belum tahu MAC','Tujuan berada pada jaringan lokal yang sama dan frame harus dikirim ke alamat Layer 2.',['IPv4 known','MAC unknown','Local network'],'ARP','ARP digunakan pada IPv4 untuk menemukan MAC yang berkaitan dengan IPv4 tertentu pada jaringan lokal.']
];
const suspectList=['DHCP','DNS','PORT/SERVICE','UDP','ARP'];
function renderCase(){const c=cases[state.case];$('#caseNum').textContent=`KASUS ${state.case+1}`;$('#caseTitle').textContent=c[0];$('#caseText').textContent=c[1];$('#caseEvidence').innerHTML=c[2].map(x=>`<span>${x}</span>`).join('');$('#suspects').innerHTML=suspectList.map(x=>`<button>${x}</button>`).join('');$('#detectiveFeedback').textContent='Pilih salah satu tersangka.';$$('#suspects button').forEach(b=>b.onclick=()=>{$$('#suspects button').forEach(x=>x.classList.remove('ok','bad'));const ok=b.textContent===c[3];b.classList.add(ok?'ok':'bad');$('#detectiveFeedback').textContent=(ok?'✓ Tepat. ':'Belum tepat. ')+c[4]});$('#casePrev').disabled=state.case===0;$('#caseNext').textContent=state.case===cases.length-1?'Kembali ke kasus 1 ↻':'Kasus berikutnya →'}
$('#caseNext').onclick=()=>{state.case=(state.case+1)%cases.length;renderCase()};$('#casePrev').onclick=()=>{if(state.case>0)state.case--;renderCase()};renderCase();

const quiz=[
 ['Transport Layer paling tepat menjawab pertanyaan...',['Kabel apa yang dipakai?','Aplikasi/proses mana yang harus menerima data?','MAC siapa pada link lokal?','Topologi apa yang digunakan?'],1,'Transport Layer berfokus pada komunikasi process-to-process dan port.'],
 ['Jika IP Address dianalogikan sebagai alamat gedung, port paling cocok dianalogikan sebagai...',['Nomor ruangan','Nama kota','Warna kabel','Nomor seri switch'],0,'IP mengarahkan ke host, port membantu mengarahkan ke aplikasi/layanan.'],
 ['Port yang umum digunakan HTTPS adalah...',['21','53','80','443'],3,'HTTPS umumnya menggunakan TCP port 443.'],
 ['Pernyataan paling tepat tentang TCP adalah...',['Tidak membangun koneksi','Menyediakan mekanisme reliabilitas dan menjaga urutan','Selalu lebih cepat dari UDP','Tidak menggunakan port'],1,'TCP connection-oriented dan memiliki mekanisme acknowledgement/retransmission serta ordering.'],
 ['Pernyataan paling tepat tentang UDP adalah...',['Tidak boleh digunakan untuk DNS','Tidak menggunakan IP','Lebih ringan dan tidak menyediakan reliabilitas seperti TCP','Selalu terenkripsi'],2,'UDP connectionless dan tidak menyediakan guarantee delivery/order pada level UDP.'],
 ['Laptop baru tersambung Wi‑Fi dan memperoleh IP, subnet mask, gateway, serta DNS server otomatis. Layanan utama yang terlibat adalah...',['DNS','DHCP','HTTPS','ARP'],1,'DHCP memberikan konfigurasi jaringan secara otomatis.'],
 ['Pengguna mengetik opac.perpustakaan.ac.id. Sistem perlu mengetahui IP server. Layanan yang dibutuhkan adalah...',['DNS','DHCP','ARP','TCP handshake'],0,'DNS menerjemahkan nama domain menjadi IP.'],
 ['Urutan three-way handshake TCP yang benar adalah...',['ACK → SYN → FIN','SYN → SYN-ACK → ACK','DNS → DHCP → HTTP','ARP → SYN → DNS'],1,'TCP membangun koneksi melalui SYN, SYN-ACK, lalu ACK.'],
 ['Komputer mengakses server di luar jaringan lokal. Pada link lokal pertama, MAC yang dibutuhkan adalah...',['MAC server jauh','MAC default gateway','MAC DNS publik','Tidak perlu MAC'],1,'Data Link membutuhkan MAC next hop pada link saat ini. Untuk tujuan luar jaringan biasanya MAC default gateway.'],
 ['Kombinasi paling tepat ketika membuka website HTTPS adalah...',['DNS mencari nama→IP, TCP membangun koneksi, HTTPS menggunakan port 443','DHCP mencari nama→IP, UDP selalu port 443','ARP memberikan IP laptop, DNS membuat frame','HTTP memberikan default gateway'],0,'Ini merangkum fungsi DNS, TCP, dan HTTPS/port 443 dengan benar.']
];
function renderQuiz(){const q=quiz[state.quiz];$('#quizProgress').textContent=`Soal ${state.quiz+1}/${quiz.length}`;$('#quizBar').style.width=(state.quiz/quiz.length*100)+'%';$('#liveScore').textContent=state.score;$('#quizArea').innerHTML=`<div class="question"><h3>${q[0]}</h3><div class="answers">${q[1].map((x,i)=>`<button class="answer" data-i="${i}">${String.fromCharCode(65+i)}. ${x}</button>`).join('')}</div><div class="explanation hidden"></div></div>`;state.answered=false;$('#quizNext').disabled=true;$('#quizNext').textContent=state.quiz===quiz.length-1?'Lihat hasil →':'Soal berikutnya →';$$('.answer').forEach(b=>b.onclick=()=>{if(state.answered)return;state.answered=true;const i=+b.dataset.i;$$('.answer').forEach((x,j)=>{if(j===q[2])x.classList.add('correct');if(j===i&&i!==q[2])x.classList.add('wrong')});if(i===q[2])state.score+=10;$('#liveScore').textContent=state.score;const e=$('.explanation');e.classList.remove('hidden');e.innerHTML=`<b>${i===q[2]?'Benar':'Belum tepat'}.</b> ${q[3]}`;$('#quizNext').disabled=false})}
$('#quizNext').onclick=()=>{if(state.quiz<quiz.length-1){state.quiz++;renderQuiz()}else showResult()};
function showResult(){$('#quizBox').classList.add('hidden');$('#result').classList.remove('hidden');$('#finalScore').textContent=state.score;const pass=state.score>=80;$('#resultTitle').textContent=pass?'Siap lanjut materi berikutnya.':'Masih perlu satu putaran lagi.';$('#resultText').textContent=pass?'Kamu sudah menguasai hubungan Transport Layer, port, TCP/UDP, serta DHCP, DNS, dan layanan web pada level yang ditargetkan.':'Ulangi bagian yang masih membingungkan, terutama Perjalanan Request dan Service Detective, lalu coba lagi.';state.completed.add('quiz');localStorage.setItem('tlCompleted',JSON.stringify([...state.completed]));updateProgress()}
function restartQuiz(){state.quiz=0;state.score=0;state.answered=false;$('#quizBox').classList.remove('hidden');$('#result').classList.add('hidden');renderQuiz()}
$('#retryQuiz').onclick=restartQuiz;renderQuiz();
