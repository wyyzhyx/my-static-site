// 🚨 重要：请替换下面的 URL 为你的 Cloudflare Worker 地址！
const WORKER_URL = 'https://your-worker-name.your-username.workers.dev';

document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // 阻止默认提交行为

    const form = e.target;
    const resultDiv = document.getElementById('formResult');

    // 显示“正在发送”
    resultDiv.className = '';
    resultDiv.style.display = 'block';
    resultDiv.textContent = '正在发送...';
    form.querySelector('button').disabled = true;

    const formData = new FormData(form);

    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            // 成功！
            resultDiv.className = 'success';
            resultDiv.textContent = '✅ 提交成功！我会尽快回复你。';
            form.reset(); // 清空表单
        } else {
            // 失败！
            const errorText = await response.text();
            resultDiv.className = 'error';
            resultDiv.textContent = `❌ 提交失败: ${errorText}`;
        }
    } catch (error) {
        resultDiv.className = 'error';
        resultDiv.textContent = `❌ 网络错误: ${error.message}`;
    } finally {
        form.querySelector('button').disabled = false;
    }
});