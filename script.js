// 🚨 重要：请替换下面的 URL 为你的 Cloudflare Worker 地址！
const WORKER_URL = 'https://your-worker-name.your-username.workers.dev';

// 轮播图功能
let currentSlide = 0;
const slides = document.querySelectorAll('.banner-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
}

// 点击小圆点切换
dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'));
        showSlide(index);
    });
});

// 自动轮播
setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}, 5000);

// 导航栏滚动变色
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 平滑滚动
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        window.scrollTo({
            top: targetElement.offsetTop - 70,
            behavior: 'smooth'
        });
    });
});

// 表单提交
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const resultDiv = document.getElementById('formResult');
    
    resultDiv.className = '';
    resultDiv.style.display = 'block';
    resultDiv.textContent = '正在发送...';
    form.querySelector('.btn').disabled = true;

    const formData = new FormData(form);

    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            resultDiv.className = 'success';
            resultDiv.textContent = '✅ 提交成功！我们会尽快与您联系。';
            form.reset();
        } else {
            const errorText = await response.text();
            resultDiv.className = 'error';
            resultDiv.textContent = `❌ 提交失败: ${errorText}`;
        }
    } catch (error) {
        resultDiv.className = 'error';
        resultDiv.textContent = `❌ 网络错误: ${error.message}`;
    } finally {
        form.querySelector('.btn').disabled = false;
    }
});