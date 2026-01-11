package com.bankcqrsexample.cqrs.core.events;

import com.bankcqrsexample.cqrs.core.messages.Message;

public abstract class BaseEvent extends Message {
    private int version;

    public BaseEvent() {
        super("");
    }

    public BaseEvent(String id, int version) {
        super(id);
        this.version = version;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }
}
