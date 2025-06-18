package com.example.ftpsearch.util;

import java.text.DecimalFormat;

public class FileSizeFormatter {

    private static final String[] UNITS = new String[]{"B", "KB", "MB", "GB", "TB"};
    private static final DecimalFormat DECIMAL_FORMAT = new DecimalFormat("#.##");

    public static String formatSize(long bytes) {
        if (bytes <= 0) return "0 B";
        int digitGroups = (int) (Math.log10(bytes) / Math.log10(1024));
        return DECIMAL_FORMAT.format(bytes / Math.pow(1024, digitGroups)) + " " + UNITS[digitGroups];
    }
}    