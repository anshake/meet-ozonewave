package com.shake.ow.command;

import java.util.List;

public record CommandDescriptor(String command, String description, List<CommandParameter> parameters) {}