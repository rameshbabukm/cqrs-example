package com.bankcqrsexample.account.cmd.api.commands;

import com.bankcqrsexample.account.common.dto.AccountType;
import com.bankcqrsexample.cqrs.core.commands.BaseCommand;

public class OpenAccountCommand extends BaseCommand {
    private String accountHolder;
    private AccountType accountType;
    private double openingBalance;

    public OpenAccountCommand() {
        super("");
    }

    public OpenAccountCommand(String id, String accountHolder, AccountType accountType, double openingBalance) {
        super(id);
        this.accountHolder = accountHolder;
        this.accountType = accountType;
        this.openingBalance = openingBalance;
    }

    public String getAccountHolder() {
        return accountHolder;
    }

    public void setAccountHolder(String accountHolder) {
        this.accountHolder = accountHolder;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public double getOpeningBalance() {
        return openingBalance;
    }

    public void setOpeningBalance(double openingBalance) {
        this.openingBalance = openingBalance;
    }
}
