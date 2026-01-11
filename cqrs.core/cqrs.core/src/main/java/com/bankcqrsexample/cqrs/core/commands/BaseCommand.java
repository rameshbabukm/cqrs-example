package com.bankcqrsexample.cqrs.core.commands;

import com.bankcqrsexample.cqrs.core.messages.Message;

public abstract class BaseCommand extends Message {

    public BaseCommand() {
        super("");
    }

    public BaseCommand(String id) {
        super(id);
    }
}
