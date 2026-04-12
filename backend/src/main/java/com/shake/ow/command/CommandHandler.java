package com.shake.ow.command;

public interface CommandHandler {

    String commandId();

    CommandResult handle(String arg, String conversationId, String tone);
}
