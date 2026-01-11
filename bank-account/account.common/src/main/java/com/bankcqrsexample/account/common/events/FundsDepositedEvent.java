package com.bankcqrsexample.account.common.events;

import com.bankcqrsexample.cqrs.core.events.BaseEvent;

public class FundsDepositedEvent extends BaseEvent {
    private double amount;

    public FundsDepositedEvent() {
        super();
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }
}
