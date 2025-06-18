package com.example.ftpsearch;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class FtpSearchApplicationTests {

    @Test
    void contextLoads() {
        // 此测试仅验证Spring应用上下文是否可以成功加载
        // 如果上下文无法加载，测试将失败并显示错误信息
    }

    // 可以添加更多的应用级测试，例如：
    // - 验证配置属性是否正确加载
    // - 检查关键组件是否正确初始化
    // - 验证应用的基本功能是否可用

}    