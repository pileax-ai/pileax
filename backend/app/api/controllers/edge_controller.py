import os
import tempfile

import edge_tts
from fastapi import HTTPException
from starlette.responses import StreamingResponse

from app.api.deps import SessionDep, CurrentUserId, CurrentWorkspaceId
from app.api.models.edge import EdgeTTS


class EdgeController:
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        workspace_id: CurrentWorkspaceId
    ):
        pass

    def get_voices(self):
        """
        Get all voices
        """
        try:
            # Use edge-tts command line
            import subprocess
            result = subprocess.run(
                ["edge-tts", "--list-voices"],
                capture_output=True,
                text=True,
                timeout=10
            )
            voices = []
            for line in result.stdout.strip().split('\n')[1:]:  # 跳过表头
                if line:
                    parts = [p.strip() for p in line.split('  ') if p.strip()]
                    if len(parts) >= 3:
                        voices.append({
                            "name": parts[0],
                            "locale": parts[1],
                            "gender": parts[2]
                        })
            return voices
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to fetch voices: {str(e)}")

    async def tts(self, item_in: EdgeTTS):
        try:
            # 1. 创建临时文件存放音频
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
            temp_path = temp_file.name
            temp_file.close()

            # 2. 使用 edge-tts 生成语音
            communicate = edge_tts.Communicate(
                text=item_in.text,
                voice=item_in.voice,
                rate=item_in.rate,
                pitch=item_in.pitch,
                volume=item_in.volume
            )

            # 3. 将生成的音频保存到临时文件
            await communicate.save(temp_path)

            # 4. 以流式响应返回音频文件
            def iterfile():
                with open(temp_path, "rb") as f:
                    yield from f
                # 流式传输完成后删除临时文件
                os.unlink(temp_path)

            return StreamingResponse(
                iterfile(),
                media_type="audio/mpeg",
                headers={
                    "Content-Disposition": f"attachment; filename=tts_output.mp3",
                    "Content-Length": str(os.path.getsize(temp_path))
                }
            )
        except Exception as e:
            # 如果创建了临时文件但出错，尝试清理
            if 'temp_path' in locals() and os.path.exists(temp_path):
                os.unlink(temp_path)
            raise HTTPException(status_code=500, detail=f"Edge TTS generation failed: {str(e)}")
