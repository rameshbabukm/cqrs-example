package com.bankcqrsexample.account.common.events;

import com.bankcqrsexample.cqrs.core.events.BaseEvent;

public class FundsWithdrawnEvent extends BaseEvent {
    private double amount;

    public FundsWithdrawnEvent() {
        super();
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }
}
