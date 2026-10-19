
const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>[...p.querySelectorAll(s)];

const scenes=[...document.querySelectorAll('.scene')];
const stageLabels=['Mulai','Connect','DHCP','Domain','DNS','Transport','TCP/UDP','Handshake','HTTPS','Ringkasan','Detective','Kuis'];
const state={
  index:Number(localStorage.getItem('transportStoryIndex')||0),
  dora:0, service:'HTTPS', handshake:0, caseIndex:0,
  quizIndex:0, quizScore:0, quizAnswered:false
};

function buildProgress(){
  $('#storyProgressLabels').innerHTML=stageLabels.map((x,i)=>`<span data-p="${i}">${x}</span>`).join('');
}
buildProgress();

function showScene(i,save=true){
  state.index=Math.max(0,Math.min(i,scenes.length-1));
  scenes.forEach((s,j)=>s.classList.toggle('active',j===state.index));
  const pct=scenes.length===1?100:state.index/(scenes.length-1)*100;
  $('#storyProgressFill').style.width=pct+'%';
  $$('#storyProgressLabels span').forEach((x,j)=>x.classList.toggle('active',j===state.index));
  if(save)localStorage.setItem('transportStoryIndex',state.index);
  window.scrollTo({top:0,behavior:'smooth'});
}
$$('[data-next]').forEach(b=>b.onclick=()=>showScene(state.index+1));
$$('[data-prev]').forEach(b=>b.onclick=()=>showScene(state.index-1));
$$('[data-go-first]').forEach(b=>b.onclick=()=>showScene(0));
showScene(state.index,false);

$('#themeBtn').onclick=()=>{
  const dark=document.documentElement.dataset.theme==='dark';
  document.documentElement.dataset.theme=dark?'':'dark';
  localStorage.setItem('transportTheme',dark?'light':'dark');
};
if(localStorage.getItem('transportTheme')==='dark')document.documentElement.dataset.theme='dark';

$('#resetBtn').onclick=()=>{
  if(confirm('Reset progres belajar dan kuis?')){
    localStorage.removeItem('transportStoryIndex');
    state.index=0;state.quizIndex=0;state.quizScore=0;state.quizAnswered=false;
    restartQuiz();showScene(0);
  }
};

// DHCP DORA
const doraTexts=[
  '<b>Discover:</b> klien mencari DHCP server. Dalam bahasa sederhana: “Ada yang bisa memberi saya konfigurasi jaringan?”',
  '<b>Offer:</b> DHCP server menawarkan konfigurasi yang bisa dipakai klien.',
  '<b>Request:</b> klien meminta untuk menggunakan tawaran konfigurasi tersebut.',
  '<b>Acknowledge:</b> server mengonfirmasi bahwa konfigurasi dapat digunakan klien.'
];
function renderDora(){
  $$('#doraSteps button').forEach((b,i)=>b.classList.toggle('active',i===state.dora));
  $('#doraExplain').innerHTML=doraTexts[state.dora];
}
$$('#doraSteps button').forEach((b,i)=>b.onclick=()=>{state.dora=i;renderDora()});renderDora();

// quick checks
const quickAnswers={dhcp:'DHCP',dns:'DNS'};
$$('.mc-options').forEach(box=>{
  $$('button',box).forEach(btn=>btn.onclick=()=>{
    $$('button',box).forEach(x=>x.classList.remove('correct','wrong'));
    const ok=btn.textContent.trim()===quickAnswers[box.dataset.check];
    btn.classList.add(ok?'correct':'wrong');
    const f=box.nextElementSibling;
    f.textContent=ok?'✓ Tepat. '+(box.dataset.check==='dhcp'?'DHCP memberi konfigurasi jaringan otomatis.':'DNS menangani resolusi nama domain menjadi IP.'):'Belum tepat. Baca kembali masalah yang sedang terjadi.';
  });
});

// typing demo
const domain='opac.perpustakaan.ac.id';
let typing=false;
$('#typeDomainBtn').onclick=()=>{
  if(typing)return;typing=true;$('#typedDomain').textContent='';
  let i=0;const timer=setInterval(()=>{ $('#typedDomain').textContent=domain.slice(0,++i); if(i>=domain.length){clearInterval(timer);typing=false;} },55);
};

// port lab
const ports={HTTPS:'443',HTTP:'80',DNS:'53',DHCP:'67/68'};
$$('#serviceTabs button').forEach(b=>b.onclick=()=>{
  state.service=b.dataset.service;
  $$('#serviceTabs button').forEach(x=>x.classList.toggle('active',x===b));
  $('#portFeedback').textContent='Pilih salah satu port.';
  $('#portFeedback').style.color='';
});
$$('.port-options button').forEach(b=>b.onclick=()=>{
  const ok=b.dataset.port===ports[state.service];
  $('#portFeedback').textContent=ok?`✓ Benar. ${state.service} menggunakan ${b.dataset.port} pada konteks dasar ini.`:`Belum tepat. Coba ingat layanan ${state.service}.`;
  $('#portFeedback').style.color=ok?'#a8ecc9':'#ffcaca';
});

// TCP UDP decisions
const decisions=[
  ['Membuka halaman OPAC yang perlu data lengkap dan berurutan','TCP','Pada pembelajaran dasar, HTTP/HTTPS tradisional dibahas menggunakan TCP karena reliabilitas penting.'],
  ['Voice call real-time: paket terlambat sering lebih baik dilewati daripada menunggu terlalu lama','UDP','Banyak aplikasi real-time menggunakan UDP atau mekanisme serupa untuk menjaga latensi rendah.'],
  ['Query DNS sederhana untuk mencari IP dari nama domain','UDP','DNS query biasa sering menggunakan UDP, walaupun DNS juga dapat memakai TCP pada kondisi tertentu.']
];
const ds=$('#decisionScenarios');
decisions.forEach((d,i)=>{
  const row=document.createElement('div');row.className='decision-row';
  row.innerHTML=`<div><b>${i+1}. ${d[0]}</b><p>Pilih protokol.</p></div><div><button>TCP</button><button>UDP</button></div>`;
  $$('button',row).forEach(btn=>btn.onclick=()=>{
    $$('button',row).forEach(x=>x.classList.remove('correct','wrong'));
    const ok=btn.textContent===d[1];btn.classList.add(ok?'correct':'wrong');
    $('p',row).textContent=d[2];
  });
  ds.appendChild(row);
});

// handshake
const hsNarr=[
  'Client belum memulai koneksi.',
  'SYN: client meminta untuk memulai koneksi.',
  'SYN + ACK: server menyatakan siap dan mengakui permintaan client.',
  'ACK: client mengonfirmasi. Koneksi TCP siap digunakan.'
];
function renderHandshake(){
  $$('.hs-message').forEach(x=>x.classList.remove('show'));
  if(state.handshake>=1)$('#hsSyn').classList.add('show');
  if(state.handshake>=2)$('#hsSynAck').classList.add('show');
  if(state.handshake>=3)$('#hsAck').classList.add('show');
  $('#hsNarration').textContent=hsNarr[state.handshake];
  const b=$('#handshakeBtn'), badge=$('#connectionState');
  b.disabled=false;
  if(state.handshake===0){b.textContent='Mulai: kirim SYN';badge.textContent='Belum terhubung'}
  if(state.handshake===1){b.textContent='Server balas SYN + ACK';badge.textContent='Langkah 1/3'}
  if(state.handshake===2){b.textContent='Client kirim ACK';badge.textContent='Langkah 2/3'}
  if(state.handshake===3){b.textContent='Koneksi terbentuk ✓';badge.textContent='TCP connection ready';b.disabled=true}
}
$('#handshakeBtn').onclick=()=>{if(state.handshake<3)state.handshake++;renderHandshake()};
$('#handshakeReset').onclick=()=>{state.handshake=0;renderHandshake()};
renderHandshake();

// HTTPS animation
let requestDone=false;
$('#sendRequestBtn').onclick=()=>{
  if(requestDone){
    $('#requestPacket').classList.remove('move');$('#responsePacket').classList.remove('move');$('#opacSuccess').classList.add('hidden');requestDone=false;$('#sendRequestBtn').textContent='Kirim request';return;
  }
  requestDone=true;$('#sendRequestBtn').disabled=true;
  $('#requestPacket').classList.add('move');
  setTimeout(()=>$('#responsePacket').classList.add('move'),650);
  setTimeout(()=>{$('#opacSuccess').classList.remove('hidden');$('#sendRequestBtn').disabled=false;$('#sendRequestBtn').textContent='Ulangi animasi ↻'},1250);
};

// detective
const cases=[
  {
    title:'Laptop sudah tersambung Wi‑Fi tetapi tidak mendapatkan konfigurasi IP',
    text:'Pengguna terhubung ke jaringan, tetapi alamat jaringan yang diharapkan tidak diperoleh secara otomatis.',
    evidence:['Wi‑Fi connected','IP otomatis gagal'], answer:'DHCP',
    why:'DHCP bertugas memberikan konfigurasi IP secara otomatis kepada klien.'
  },
  {
    title:'Server bisa diakses lewat IP, tetapi gagal jika memakai nama domain',
    text:'Koneksi ke IP server berhasil. Masalah muncul hanya ketika pengguna memakai nama domain.',
    evidence:['IP reachable','Nama domain gagal'], answer:'DNS',
    why:'Karena akses berdasarkan IP berhasil, masalah paling logis ada pada resolusi nama menjadi IP, yaitu DNS.'
  },
  {
    title:'DNS berhasil dan host dapat dijangkau, tetapi layanan web tertentu tidak merespons',
    text:'Nama domain sudah menjadi IP dan host reachable, tetapi layanan web tetap tidak menjawab.',
    evidence:['DNS OK','Host reachable','Service unavailable'], answer:'PORT/SERVICE',
    why:'Masalah lebih mengarah pada layanan atau port yang tidak tersedia/tidak merespons.'
  },
  {
    title:'Aplikasi real-time terganggu jika selalu menunggu paket yang terlambat',
    text:'Pada komunikasi suara, menunggu retransmission terlalu lama justru menurunkan kualitas percakapan.',
    evidence:['Real-time','Latency sensitive'], answer:'UDP',
    why:'Banyak aplikasi real-time memakai UDP atau mekanisme serupa karena latensi rendah sering lebih penting.'
  },
  {
    title:'Komputer tahu IPv4 host lokal tetapi belum tahu MAC-nya',
    text:'Tujuan masih satu jaringan lokal dan frame membutuhkan alamat Layer 2 tujuan.',
    evidence:['IPv4 known','MAC unknown','Local network'], answer:'ARP',
    why:'ARP digunakan pada IPv4 untuk menemukan MAC yang terkait dengan IPv4 tertentu pada jaringan lokal.'
  }
];
const suspects=['DHCP','DNS','PORT/SERVICE','UDP','ARP'];
function renderCase(){
  const c=cases[state.caseIndex];
  $('#caseNumber').textContent=`KASUS ${state.caseIndex+1} / ${cases.length}`;
  $('#caseTitle').textContent=c.title;$('#caseText').textContent=c.text;
  $('#caseEvidence').innerHTML=c.evidence.map(x=>`<span>${x}</span>`).join('');
  $('#suspects').innerHTML=suspects.map(x=>`<button>${x}</button>`).join('');
  $('#detectiveFeedback').textContent='Pilih satu tersangka.';
  $$('#suspects button').forEach(btn=>btn.onclick=()=>{
    $$('#suspects button').forEach(x=>x.classList.remove('correct','wrong'));
    const ok=btn.textContent===c.answer;btn.classList.add(ok?'correct':'wrong');
    $('#detectiveFeedback').textContent=(ok?'✓ Tepat. ':'Belum tepat. ')+c.why;
  });
  $('#prevCase').disabled=state.caseIndex===0;
  $('#nextCase').textContent=state.caseIndex===cases.length-1?'Kembali ke kasus 1 ↻':'Kasus berikutnya →';
}
$('#nextCase').onclick=()=>{state.caseIndex=(state.caseIndex+1)%cases.length;renderCase()};
$('#prevCase').onclick=()=>{if(state.caseIndex>0)state.caseIndex--;renderCase()};
renderCase();

// quiz
const quiz=[
  ['Transport Layer paling tepat menjawab pertanyaan...',['Kabel apa yang dipakai?','Aplikasi/proses mana yang harus menerima data?','MAC siapa pada link lokal?','Topologi apa yang digunakan?'],1,'Transport Layer membantu komunikasi process-to-process dan menggunakan port untuk mengidentifikasi layanan.'],
  ['Jika IP Address dianalogikan sebagai alamat gedung, port paling cocok dianalogikan sebagai...',['Nomor ruangan','Nama kota','Warna kabel','Nomor seri switch'],0,'IP mengarahkan ke host, sedangkan port membantu mengarahkan ke aplikasi atau layanan.'],
  ['Port yang umum digunakan HTTPS adalah...',['21','53','80','443'],3,'HTTPS umumnya menggunakan TCP port 443.'],
  ['Pernyataan paling tepat tentang TCP adalah...',['Tidak membangun koneksi','Menyediakan mekanisme reliabilitas dan menjaga urutan','Selalu lebih cepat dari UDP','Tidak menggunakan port'],1,'TCP connection-oriented dan memiliki mekanisme acknowledgement/retransmission serta ordering.'],
  ['Pernyataan paling tepat tentang UDP adalah...',['Tidak boleh digunakan untuk DNS','Tidak menggunakan IP','Lebih ringan dan tidak menyediakan reliability seperti TCP','Selalu terenkripsi'],2,'UDP connectionless dan tidak menyediakan guarantee delivery/order pada level UDP.'],
  ['Laptop baru tersambung Wi‑Fi dan memperoleh IP, subnet mask, gateway, serta DNS server otomatis. Layanan utama yang terlibat adalah...',['DNS','DHCP','HTTPS','ARP'],1,'DHCP memberikan konfigurasi jaringan secara otomatis.'],
  ['Pengguna mengetik opac.perpustakaan.ac.id. Sistem perlu mengetahui IP server. Layanan yang dibutuhkan adalah...',['DNS','DHCP','ARP','TCP handshake'],0,'DNS menerjemahkan nama domain menjadi IP Address.'],
  ['Urutan three-way handshake TCP yang benar adalah...',['ACK → SYN → FIN','SYN → SYN-ACK → ACK','DNS → DHCP → HTTP','ARP → SYN → DNS'],1,'TCP membangun koneksi melalui SYN, SYN-ACK, lalu ACK.'],
  ['Komputer mengakses server di luar jaringan lokal. Pada link lokal pertama, MAC yang dibutuhkan adalah...',['MAC server jauh','MAC default gateway','MAC DNS publik','Tidak perlu MAC'],1,'Data Link membutuhkan MAC next hop pada link saat ini; untuk tujuan luar jaringan biasanya MAC default gateway.'],
  ['Kombinasi paling tepat ketika membuka website HTTPS adalah...',['DNS mencari nama→IP, TCP membangun koneksi, HTTPS menggunakan port 443','DHCP mencari nama→IP, UDP selalu port 443','ARP memberikan IP laptop, DNS membuat frame','HTTP memberikan default gateway'],0,'Ini merangkum fungsi DNS, TCP, dan HTTPS/port 443 dengan benar.']
];
function renderQuiz(){
  const q=quiz[state.quizIndex];
  $('#quizProgress').textContent=`Soal ${state.quizIndex+1}/${quiz.length}`;
  $('#quizProgressFill').style.width=(state.quizIndex/quiz.length*100)+'%';
  $('#liveScore').textContent=state.quizScore;
  $('#quizArea').innerHTML=`<div class="question-card"><h3>${q[0]}</h3><div class="answer-list">${q[1].map((x,i)=>`<button class="answer-btn" data-i="${i}">${String.fromCharCode(65+i)}. ${x}</button>`).join('')}</div><div class="quiz-explain hidden"></div></div>`;
  state.quizAnswered=false;$('#quizNextBtn').disabled=true;
  $('#quizNextBtn').textContent=state.quizIndex===quiz.length-1?'Lihat hasil →':'Soal berikutnya →';
  $$('.answer-btn').forEach(btn=>btn.onclick=()=>{
    if(state.quizAnswered)return;state.quizAnswered=true;
    const chosen=Number(btn.dataset.i);
    $$('.answer-btn').forEach((x,i)=>{if(i===q[2])x.classList.add('correct');if(i===chosen&&chosen!==q[2])x.classList.add('wrong')});
    if(chosen===q[2])state.quizScore+=10;
    $('#liveScore').textContent=state.quizScore;
    const ex=$('.quiz-explain');ex.classList.remove('hidden');ex.innerHTML=`<b>${chosen===q[2]?'Benar':'Belum tepat'}.</b> ${q[3]}`;
    $('#quizNextBtn').disabled=false;
  });
}
$('#quizNextBtn').onclick=()=>{if(state.quizIndex<quiz.length-1){state.quizIndex++;renderQuiz()}else showResult()};
function showResult(){
  $('#quizShell').classList.add('hidden');$('#resultCard').classList.remove('hidden');
  $('#finalScore').textContent=state.quizScore;$('#quizProgressFill').style.width='100%';
  const pass=state.quizScore>=80;
  $('#resultTitle').textContent=pass?'Siap lanjut materi berikutnya.':'Masih perlu satu putaran lagi.';
  $('#resultText').textContent=pass?'Kamu sudah memahami hubungan Transport Layer, port, TCP/UDP, DHCP, DNS, dan layanan web pada level yang ditargetkan.':'Ulangi bagian perjalanan utama dan Service Detective, lalu coba kuis kembali.';
}
function restartQuiz(){
  state.quizIndex=0;state.quizScore=0;state.quizAnswered=false;
  $('#quizShell').classList.remove('hidden');$('#resultCard').classList.add('hidden');renderQuiz();
}
$('#retryQuiz').onclick=restartQuiz;renderQuiz();
