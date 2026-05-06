package com.shake.ow.command;

public interface CommandHandler {

    CommandDescriptor commandDesc();

    CommandResult handle(String arg, String conversationId, String tone);
}
