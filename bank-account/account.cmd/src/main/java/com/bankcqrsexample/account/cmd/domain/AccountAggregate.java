package com.bankcqrsexample.account.cmd.domain;

import com.bankcqrsexample.account.cmd.api.commands.OpenAccountCommand;
import com.bankcqrsexample.account.common.events.AccountClosedEvent;
import com.bankcqrsexample.account.common.events.AccountOpenedEvent;
import com.bankcqrsexample.account.common.events.FundsDepositedEvent;
import com.bankcqrsexample.account.common.events.FundsWithdrawnEvent;
import com.bankcqrsexample.cqrs.core.domain.AggregateRoot;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@Getter
public class AccountAggregate extends AggregateRoot {

    private Boolean active;
    private double balance;


    public AccountAggregate(OpenAccountCommand command) {
        var event = new AccountOpenedEvent();
        event.setId(command.getId());
        event.setAccountHolder(command.getAccountHolder());
        event.setCreatedDate(new Date());
        event.setAccountType(command.getAccountType());
        event.setOpeningBalance(command.getOpeningBalance());
        raiseEvent(event);
    }

    public void apply(AccountOpenedEvent event) {
        this.id = event.getId();
        this.active = true;
        this.balance = event.getOpeningBalance();
    }

    public void depositFunds(double amount) {
        if (!this.active) {
            throw new IllegalStateException("Funds cannot be deposited into a closed account!");
        }
        if(amount <= 0) {
            throw new IllegalStateException("The deposit amount must be greater than 0!");
        }
        var event = new FundsDepositedEvent();
        event.setId(this.id);
        event.setAmount(amount);
        raiseEvent(event);
    }

    public void apply(FundsDepositedEvent event) {
        this.id = event.getId();
        this.balance += event.getAmount();
    }

    public void withdrawFunds(double amount) {
        if (!this.active) {
            throw new IllegalStateException("Funds cannot be withdrawn from a closed account!");
        }
        var event = new FundsWithdrawnEvent();
        event.setId(this.id);
        event.setAmount(amount);
        raiseEvent(event);
    }

    public void apply(FundsWithdrawnEvent event) {
        this.id = event.getId();
        this.balance -= event.getAmount();
    }

    public void closeAccount() {
        if (!this.active) {
            throw new IllegalStateException("The bank account has already been closed!");
        }
        var event = new AccountClosedEvent();
        event.setId(this.id);
        raiseEvent(event);
    }

    public void apply(AccountClosedEvent event) {
        this.id = event.getId();
        this.active = false;
    }
}
