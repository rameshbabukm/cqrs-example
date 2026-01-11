package com.bankcqrsexample.account.cmd.api.commands;

import com.bankcqrsexample.cqrs.core.commands.BaseCommand;

public class DepositFundsCommand extends BaseCommand {
    private double amount;

    public DepositFundsCommand() {
        super("");
    }

    public DepositFundsCommand(String id, double amount) {
        super(id);
        this.amount = amount;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }
}
