package com.example.ftpsearch.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class FileSizeFormatterTest {

    @Test
    void testFormatBytes_WithBytes() {
        String result = FileSizeFormatter.formatBytes(512);
        assertEquals("512 B", result);
    }

    @Test
    void testFormatBytes_WithKilobytes() {
        String result = FileSizeFormatter.formatBytes(1536); // 1.5 KB
        assertEquals("1.5 KB", result);
    }

    @Test
    void testFormatBytes_WithMegabytes() {
        String result = FileSizeFormatter.formatBytes(1048576); // 1 MB
        assertEquals("1.0 MB", result);
    }

    @Test
    void testFormatBytes_WithGigabytes() {
        String result = FileSizeFormatter.formatBytes(2147483648L); // 2 GB
        assertEquals("2.0 GB", result);
    }

    @Test
    void testFormatBytes_WithTerabytes() {
        String result = FileSizeFormatter.formatBytes(1099511627776L); // 1 TB
        assertEquals("1.0 TB", result);
    }

    @Test
    void testFormatBytes_WithZeroBytes() {
        String result = FileSizeFormatter.formatBytes(0);
        assertEquals("0 B", result);
    }

    @Test
    void testFormatBytes_WithNegativeBytes() {
        String result = FileSizeFormatter.formatBytes(-1024);
        assertEquals("-1.0 KB", result);
    }

    @Test
    void testFormatBytes_WithDecimalPrecision() {
        String result = FileSizeFormatter.formatBytes(1234567);
        assertEquals("1.2 MB", result);
    }

    @Test
    void testFormatBytes_WithLargeDecimalPrecision() {
        String result = FileSizeFormatter.formatBytes(1234567890);
        assertEquals("1.1 GB", result);
    }

    @Test
    void testFormatBytes_WithExactBoundary() {
        String result = FileSizeFormatter.formatBytes(1023);
        assertEquals("1023 B", result);
    }

    @Test
    void testFormatBytes_WithMaxValue() {
        String result = FileSizeFormatter.formatBytes(Long.MAX_VALUE);
        assertEquals("8,388,607.9 TB", result);
    }
}    