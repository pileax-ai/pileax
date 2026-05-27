
from app.libs.file_helper import FileHelper


def test_get_safe_name_scenarios() -> None:
    # 1. Test empty input and edge case fallbacks
    assert FileHelper.get_safe_name("") == "unknown"
    assert FileHelper.get_safe_name("   ") == "unknown"
    assert FileHelper.get_safe_name("... ") == "unknown"
    assert FileHelper.get_safe_name('\\/*?:"<>|') == "unknown"

    # 2. Test special character replacement and trimming
    assert FileHelper.get_safe_name("hello/world") == "hello_world"
    assert FileHelper.get_safe_name("  my_file.txt  ") == "my_file.txt"
    assert FileHelper.get_safe_name("test_name.") == "test_name"

    # 3. Test Windows reserved names
    assert FileHelper.get_safe_name("con") == "_con"
    assert FileHelper.get_safe_name("PRN") == "_PRN"

    # 4. Test control characters (0x00 - 0x1F)
    assert FileHelper.get_safe_name("a\x00b\x1fc") == "a_b_c"


def test_get_safe_name_long_chinese() -> None:
    # 5. Test your exact ultra-long Chinese book title scenario
    # Ensures the output is safely truncated by bytes and doesn't cause [Errno 36]
    long_name = (
        "枪炮、病菌与钢铁（全新版本，重磅上市！全面增补校订书稿。"
        "作者亲笔撰写中文出版序！附赠《解读册》陈嘉映、俞敏洪、"
        "吴军、梁文道、严飞、郝景芳等15位专家倾力解读。"
        "人类大历史开山之作，美国普利策奖获奖作品）"
    )

    safe_name = FileHelper.get_safe_name(long_name)

    # Verify that the byte length does not exceed 200 bytes
    assert len(safe_name.encode("utf-8")) <= 200

    # Verify that it is still a valid string and doesn't end with a dot
    assert not safe_name.endswith(".")
    assert len(safe_name) > 0
