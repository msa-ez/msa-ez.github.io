---
description: ''
sidebar: 'started'
---

<!-- <h1>구내 설치형 AI기반 분석설계 및 구현, 배포<br>(MSAEZ + DeepSeek)</h1> -->
# Guide to Using DeepSeek Model in MSAEZ (RunPod Cloud GPU Environment)

**MSAEZ** now supports the use of **DeepSeek AI** inference models in a private cloud environment.

**DeepSeek models** are available in various parameter sizes including 7B and 67B, trained on over 2 trillion tokens of data. This data includes code, mathematical problems, and general text, making it applicable across various fields. Notably, most models are open-source under MIT or Apache 2.0 licenses.

By utilizing the **Ollama** tool to install DeepSeek AI models directly in a local environment, you can reduce costs and dependencies on cloud-based AI services while freely using AI capabilities in an on-premises environment.

Particularly, using DeepSeek AI enables requirement analysis and Domain-Driven Design (DDD) based cloud-native modeling through human-in-the-loop communication with designers. This allows for building more sophisticated microservice architectures while maintaining data consistency and flexible design.

This guide explains **how MSAEZ users can run DeepSeek AI models in a RunPod cloud GPU environment and integrate them with MSAEZ**. It is intended for developers looking to build AI-based microservices using MSAEZ.
<br><br>

<!-- ## MSAEZ MSA 개발 프로세스

<img src="https://github.com/user-attachments/assets/5fe9e0c5-064f-4969-ad9e-5389196f08f6">
<br>
MSAEZ는 도메인 분석을 통해 마이크로서비스를 도출하고, 헥사고날 및 이벤트 드리븐 아키텍처 기반으로 설계한 후, 자동화된 테스트와 CI/CD 배포를 통해 안정적인 MSA 개발을 지원하는 전 주기에 걸친 프로세스를 제공합니다. 
<br><br>

## 온프레미스 AI를 활용한 마이크로서비스 설계/구현/배포

<img src="https://github.com/user-attachments/assets/b2851b91-543c-47a4-82d7-335ea0b1baa7">
<br>
MSAEZ는 온프레미스 DeepSeek AI 모델을 활용하여 마이크로서비스를 자동 생성하고, 프로덕션 환경과 연동하여 마이크로서비스 설계를 자동화하고, AI를 활용한 자동화된 마이크로서비스 아키텍처 구축을 지원하여, 보다 효율적인 MSA 환경 도입을 가능하게 합니다. 
<br><br> -->


## Cloud GPU Service Configuration for DeepSeek Environment
### Setting up DeepSeek Model Environment Using RunPod

**1. You can create and request a new Pod through the Pods menu in [RunPod](https://runpod.io/).**

<img style="margin-top: -20px;" src="https://github.com/user-attachments/assets/8c1c8845-c031-4cb4-8cbb-596acc79fe47">

- The `deepseek-ai/DeepSeek-R1-Distill-Qwen-32B` model currently requires a VM with at least 80GB.
- While both community cloud and secure cloud options are available, we recommend using the **community cloud** due to current instability issues with secure cloud.
- We recommend the `4x RTX 4000 Ada` architecture; if unavailable, choose an instance with similar performance.
<br><br>

**2. Click Edit Template to configure the template.**

<img src="https://github.com/user-attachments/assets/a39f6e9a-0651-4e58-96c7-74a45cf95c99">
<br>

<img src="https://github.com/user-attachments/assets/c155ff28-3f51-47d0-96d7-e12952e6a8d9">

- For template configuration, SGLang-based options like `Qwen 2.5 Coder 32B - SGLang by Relis` are stable.
   - `--tensor-parallel-size` activates tensor parallel processing and determines how many GPUs to distribute the model across. This helps overcome single GPU memory limitations and improves inference speed through parallel processing. Generally, the optimal value should **match the number of available GPU instances**. For example, when using four RTX 4000 Ada GPU instances, set --tensor-parallel-size to 4.
   - `--mem-fraction-static` is a parameter that sets **what proportion of GPU memory to reserve statically before model execution**. While GPU memory can be allocated dynamically, memory shortage errors are likely when long context sizes are passed. To prevent this, set to pre-occupy memory by the specified ratio. **Generally, start with 0.8-0.9** and **adjust based on model size, context length, and GPU memory situation**.

```bash
python3 -m sglang.launch_server --model-path deepseek-ai/DeepSeek-R1-Distill-Qwen-32B --context-length 131072 --host 0.0.0.0 --port 8000 --tensor-parallel-size [Number of GPU instances used] --api-key [API key for LLM requests] --mem-fraction-static 0.9 --disable-cuda-graph
```

<img src="https://github.com/user-attachments/assets/92598e42-caa6-4977-9912-557914ee322f">
<br>

<img src="https://github.com/user-attachments/assets/93c4499b-51a6-4ba5-9248-d7e3a9ccd1f0">

- For Volume Disk, you can allocate about 90GB as initial capacity considering model caching and various configuration files for the current Qwen 2.5 Coder 32B model.
- Set to On-Demand for stable operation without service interruption.
<br><br>

### Verifying DeepSeek Model Configuration
#### Checking Logs

<img src="https://github.com/user-attachments/assets/73b97cce-9619-4739-80c5-039cf2d7ed23">
<br>

<img src="https://github.com/user-attachments/assets/7d25d7fa-0b86-4159-b2ad-dbb23c1e2719">

- Check logs through `Log > Container`.
- `The server is fired up and ready to roll`: This indicates when the system is actually ready for use.
<br><br>
   
#### Accessing

<img src="https://github.com/user-attachments/assets/b26e1608-85b2-42df-9e08-0e6a9439a700">
<br>

- `Connect > HTTP Service`
- The access URL is the path to the deployed Pod.

```bash
https -v POST <Request Pod URL>/v1/chat/completions \
  Authorization:"Bearer <API key for LLM requests>" \
  model="deepseek-ai/DeepSeek-R1-Distill-Qwen-32B" \
  messages:='[{"role": "user", "content": "What is the capital of France?"}]'
```
<br><br>

## Configuration for Using RunPod-based DeepSeek Model in MSAEZ

MSAEZ provides three model configurations to utilize DeepSeek models for various purposes: complexModel, standardModel, and simpleModel.

- `complexModel`: Used for complex tasks requiring high performance, such as policy generation.
- `standardModel`: Used for most general AI functions (e.g., text generation, Q&A). MSAEZ's core AI features are provided through `standardModel`.
- `simpleModel`: Used for relatively simple tasks requiring quick processing, such as JSON object error correction.
<br><br>

**1. Run the related Proxy server.**

- The `server.js` Proxy server mediates smooth communication between MSAEZ and RunPod, and MSAEZ efficiently provides various AI functions through the model configurations described above.

```bash
node ./server.js
```

**2. Modify localStorage values to use the related models.**
```js
localStorage.complexModel = "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B"
localStorage.standardModel = "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B"
localStorage.simpleModel = "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B"
localStorage.runpodUrl = "<Request Pod URL>/v1/chat/completions"
```
<img src="https://github.com/user-attachments/assets/afa73078-4398-4187-979a-e789c75a574b">
<br>

**3. After testing, reset to empty values to return to default model usage.**
```js
localStorage.complexModel = ""
localStorage.standardModel = ""
localStorage.simpleModel = ""
```
<!-- <br><br>

## On-Premises AI-based Analysis Design, Implementation, and Deployment (MSAEZ + DeepSeek)

### Demo Application Using `DeepSeek-R1-Distill-Qwen-32B` Model - Civil Complaint Application Demo

<div style="position: relative; padding-bottom: 56.25%; padding-top: 0px; height: 0; overflow: hidden;">
	<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
        src="https://www.youtube.com/embed/4PX4CWrdGCg?si=oD969pF_VGUpSf4Q&amp;start=3652" 
        frameborder="0" scrolling="no" frameborder="none" allowfullscreen="">
    </iframe>
</div> -->