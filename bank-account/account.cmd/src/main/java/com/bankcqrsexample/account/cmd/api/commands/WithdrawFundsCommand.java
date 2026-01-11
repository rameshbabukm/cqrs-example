package com.bankcqrsexample.account.cmd.api.commands;

import com.bankcqrsexample.cqrs.core.commands.BaseCommand;

public class WithdrawFundsCommand extends BaseCommand {
    private double amount;

    public WithdrawFundsCommand() {
        super("");
    }

    public WithdrawFundsCommand(String id, double amount) {
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
