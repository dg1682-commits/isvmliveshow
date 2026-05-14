/* 일일 누적 방문자 수 카운터 */
const viewerCountEl = document.getElementById('viewerCount');

function updateDailyVisitor() {
    // 오늘 날짜 가져오기 (YYYY.MM.DD 형식)
    const today = new Date().toLocaleDateString('ko-KR'); 
    
    // 로컬 스토리지에 저장된 이전 접속 날짜와 카운트 불러오기
    let savedDate = localStorage.getItem('ara_visit_date');
    let dailyCount = parseInt(localStorage.getItem('ara_daily_count')) || 0;

    if (savedDate !== today) {
        // 날짜가 바뀌었거나 첫 접속이면 카운트를 1로 초기화 (원한다면 125 등 시작 숫자를 지정해도 됩니다)
        dailyCount = 1;
        localStorage.setItem('ara_visit_date', today);
    } else {
        // 오늘 날짜가 같으면 새로고침/재접속 시 1 증가
        dailyCount++;
    }

    // 증가한 카운트 다시 저장
    localStorage.setItem('ara_daily_count', dailyCount);
    
    // 화면에 콤마(,) 찍어서 출력
    viewerCountEl.textContent = dailyCount.toLocaleString();
}

// 스크립트 실행 시 카운트 업데이트
updateDailyVisitor();


/* LIVE CHAT (이하 채팅 시스템은 기존과 동일) */
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const chatChannel = new BroadcastChannel('ara-show-chat');

function addMessage(name, message, isAdmin=false){
    const div = document.createElement('div');
    div.className = isAdmin ? 'msg admin' : 'msg';
    div.innerHTML = `<strong>${name}</strong> ${message}`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage(){
    const text = chatInput.value.trim();
    if(!text) return;

    const payload = {
        name: '일신비츠온',
        message: text
    };

    addMessage(payload.name, payload.message);
    chatChannel.postMessage(payload);
    chatInput.value = '';
}

sendBtn.addEventListener('click', sendMessage);

chatInput.addEventListener('keypress', (e)=>{
    if(e.key === 'Enter'){
        sendMessage();
    }
});

chatChannel.onmessage = (e)=>{
    addMessage(e.data.name, e.data.message);
};

/* AUTO SYSTEM CHAT */
const autoMessages = [
    '실외기 받침대 방송 특가 진행중입니다!',
    '할인권 코드【 ACB01 】1.5L롱숏폼 / 【 ACB02 】1L숏 / 【 ACB03 】2L롱숏폼 / 【 ACB04 】2L롱',
    '채팅 참여 고객 추첨 이벤트 진행중!',
    '오늘 방송 한정 무료배송!',
    '압축분무기 핸디형 특가 판매 예정!'
];

setInterval(()=>{
    const random = autoMessages[Math.floor(Math.random()*autoMessages.length)];
    addMessage('[아라쇼]', random, true);
}, 25000);

/* RIGHT BANNER SLIDER (디졸브 롤링 배너) */
const bannerImages = document.querySelectorAll('#bannerSlider .banner-img');

if (bannerImages.length > 0) {
    let currentBannerIndex = 0;
    
    // 3초(3000ms)마다 반복 실행
    setInterval(() => {
        // 1. 현재 켜져있는 이미지 숨기기 (active 클래스 제거)
        bannerImages[currentBannerIndex].classList.remove('active');
        
        // 2. 다음 이미지 번호 계산 (마지막 이미지면 다시 0번으로 돌아감)
        currentBannerIndex = (currentBannerIndex + 1) % bannerImages.length;
        
        // 3. 다음 이미지 보여주기 (active 클래스 추가)
        bannerImages[currentBannerIndex].classList.add('active');
        
    }, 3000);
}